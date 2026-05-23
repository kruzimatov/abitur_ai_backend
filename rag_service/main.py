import logging
import os
import time
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import chromadb

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("rag_service")

CHROMA_PATH = os.getenv("CHROMA_PATH", "./vectorstore")
COLLECTION_NAME = "dtm_topics"

app = FastAPI(
    title="AbiturAI RAG Service",
    version="1.0.0",
    description="DTM material retrieval service powered by ChromaDB",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(COLLECTION_NAME)


# ── Request / Response Models ────────────────────────────────────────────────

class SeedTopic(BaseModel):
    id: Optional[str] = None
    title: str
    subject: str
    content: str

class SeedData(BaseModel):
    topics: list[SeedTopic]

class QueryRequest(BaseModel):
    question: str
    subject: Optional[str] = None
    n_results: int = Field(default=3, ge=1, le=20)

class SimilarRequest(BaseModel):
    text: Optional[str] = None
    topic_id: Optional[str] = None
    n_results: int = Field(default=3, ge=1, le=10)


# ── Helpers ──────────────────────────────────────────────────────────────────

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Split text into overlapping chunks for better retrieval."""
    if len(text) <= chunk_size:
        return [text]
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start += chunk_size - overlap
    return chunks


# ── Endpoints ────────────────────────────────────────────────────────────────

@app.post("/seed")
def seed(data: SeedData):
    start = time.time()
    try:
        existing_ids = collection.get()["ids"]
        if existing_ids:
            collection.delete(ids=existing_ids)

        all_documents = []
        all_metadatas = []
        all_ids = []

        for i, topic in enumerate(data.topics):
            topic_id = topic.id or f"topic_{i}"
            chunks = chunk_text(topic.content)

            for chunk_idx, chunk in enumerate(chunks):
                doc_id = f"{topic_id}_chunk_{chunk_idx}" if len(chunks) > 1 else topic_id
                all_documents.append(chunk)
                all_metadatas.append({
                    "topic_id": topic_id,
                    "topic_title": topic.title,
                    "subject_name": topic.subject,
                    "chunk_index": chunk_idx,
                    "total_chunks": len(chunks),
                })
                all_ids.append(doc_id)

        collection.add(
            documents=all_documents,
            metadatas=all_metadatas,
            ids=all_ids,
        )
        elapsed = time.time() - start
        logger.info("Seeded %d chunks from %d topics in %.2fs", len(all_ids), len(data.topics), elapsed)
        return {
            "status": "seeded",
            "topics": len(data.topics),
            "chunks": len(all_ids),
        }
    except Exception as e:
        logger.error("Seed failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/query")
def query(q: QueryRequest):
    start = time.time()
    try:
        count = collection.count()
        if count == 0:
            return {"results": [], "sources": [], "chunks": [], "titles": []}

        where_filter = None
        if q.subject:
            where_filter = {"subject_name": q.subject}

        results = collection.query(
            query_texts=[q.question],
            n_results=min(q.n_results, count),
            where=where_filter,
        )

        documents = results["documents"][0] if results["documents"] else []
        metadatas = results["metadatas"][0] if results["metadatas"] else []

        sources = []
        seen_titles = set()
        for meta in metadatas:
            title = meta.get("topic_title", "")
            if title and title not in seen_titles:
                seen_titles.add(title)
                sources.append({
                    "document": title,
                    "section": documents[metadatas.index(meta)][:50] if documents else "",
                })

        elapsed = time.time() - start
        logger.info(
            "Query: '%s' | subject=%s | %d results | %.2fs",
            q.question[:80], q.subject or "all", len(documents), elapsed,
        )

        return {
            "results": documents,
            "sources": sources,
            # backward-compatible keys for existing TutorController
            "chunks": documents,
            "titles": [m.get("topic_title", "") for m in metadatas],
        }
    except Exception as e:
        logger.error("Query failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/similar")
def similar(req: SimilarRequest):
    start = time.time()
    try:
        count = collection.count()
        if count == 0:
            return {"topics": []}

        if req.topic_id:
            topic_docs = collection.get(
                where={"topic_id": req.topic_id},
                limit=1,
            )
            if not topic_docs["documents"]:
                raise HTTPException(status_code=404, detail=f"Topic '{req.topic_id}' not found")
            search_text = topic_docs["documents"][0]
        elif req.text:
            search_text = req.text
        else:
            raise HTTPException(status_code=400, detail="Provide either 'text' or 'topic_id'")

        results = collection.query(
            query_texts=[search_text],
            n_results=min(req.n_results + 5, count),
        )

        topics = []
        seen = set()
        for meta in results["metadatas"][0]:
            tid = meta.get("topic_id", "")
            if tid in seen or tid == req.topic_id:
                continue
            seen.add(tid)
            topics.append({
                "id": tid,
                "title": meta.get("topic_title", ""),
                "subject": meta.get("subject_name", ""),
            })
            if len(topics) >= req.n_results:
                break

        elapsed = time.time() - start
        logger.info("Similar: topic_id=%s | %d results | %.2fs", req.topic_id or "text", len(topics), elapsed)
        return {"topics": topics}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Similar failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    try:
        doc_count = collection.count()
        subjects = set()
        if doc_count > 0:
            all_meta = collection.get()["metadatas"]
            subjects = {m.get("subject_name", "") for m in all_meta if m.get("subject_name")}
        return {
            "status": "ok",
            "documents": doc_count,
            "subjects": sorted(subjects),
        }
    except Exception as e:
        logger.error("Health check failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
