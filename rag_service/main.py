import logging
import os
import time
import uuid
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
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
    version="2.0.0",
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

class DocumentRequest(BaseModel):
    topic_id: str
    title: str
    subject: str
    content: str


# ── Text Extraction ─────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    import fitz
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = []
    for page in doc:
        pages.append(page.get_text())
    doc.close()
    return "\n\n".join(pages)


def extract_text_from_docx(file_bytes: bytes) -> str:
    import io
    from docx import Document
    doc = Document(io.BytesIO(file_bytes))
    return "\n\n".join(p.text for p in doc.paragraphs if p.text.strip())


def extract_text_from_txt(file_bytes: bytes) -> str:
    for encoding in ("utf-8", "cp1251", "latin-1"):
        try:
            return file_bytes.decode(encoding)
        except UnicodeDecodeError:
            continue
    return file_bytes.decode("utf-8", errors="replace")


EXTRACTORS = {
    "application/pdf": extract_text_from_pdf,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": extract_text_from_docx,
    "text/plain": extract_text_from_txt,
}

EXTENSION_MAP = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
}


def detect_content_type(filename: str, declared_type: Optional[str]) -> str:
    if declared_type and declared_type in EXTRACTORS:
        return declared_type
    ext = os.path.splitext(filename)[1].lower()
    mapped = EXTENSION_MAP.get(ext)
    if mapped:
        return mapped
    raise HTTPException(
        status_code=400,
        detail=f"Unsupported file type: {ext}. Supported: .pdf, .docx, .txt",
    )


# ── Helpers ──────────────────────────────────────────────────────────────────

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
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


def add_topic_to_collection(topic_id: str, title: str, subject: str, content: str) -> int:
    chunks = chunk_text(content)
    documents = []
    metadatas = []
    ids = []
    for chunk_idx, chunk in enumerate(chunks):
        doc_id = f"{topic_id}_chunk_{chunk_idx}" if len(chunks) > 1 else topic_id
        documents.append(chunk)
        metadatas.append({
            "topic_id": topic_id,
            "topic_title": title,
            "subject_name": subject,
            "chunk_index": chunk_idx,
            "total_chunks": len(chunks),
        })
        ids.append(doc_id)
    collection.add(documents=documents, metadatas=metadatas, ids=ids)
    return len(ids)


def remove_topic_from_collection(topic_id: str) -> int:
    existing = collection.get(where={"topic_id": topic_id})
    if not existing["ids"]:
        return 0
    collection.delete(ids=existing["ids"])
    return len(existing["ids"])


# ── Endpoints: Bulk Seed (existing) ─────────────────────────────────────────

@app.post("/seed")
def seed(data: SeedData):
    start = time.time()
    try:
        existing_ids = collection.get()["ids"]
        if existing_ids:
            collection.delete(ids=existing_ids)

        total_chunks = 0
        for i, topic in enumerate(data.topics):
            topic_id = topic.id or f"topic_{i}"
            total_chunks += add_topic_to_collection(
                topic_id, topic.title, topic.subject, topic.content,
            )

        elapsed = time.time() - start
        logger.info("Seeded %d chunks from %d topics in %.2fs", total_chunks, len(data.topics), elapsed)
        return {
            "status": "seeded",
            "topics": len(data.topics),
            "chunks": total_chunks,
        }
    except Exception as e:
        logger.error("Seed failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


# ── Endpoints: Document CRUD ────────────────────────────────────────────────

@app.post("/documents")
def create_document(doc: DocumentRequest):
    start = time.time()
    try:
        existing = collection.get(where={"topic_id": doc.topic_id})
        if existing["ids"]:
            raise HTTPException(
                status_code=409,
                detail=f"Topic '{doc.topic_id}' already exists. Use PUT to update.",
            )
        chunks_added = add_topic_to_collection(
            doc.topic_id, doc.title, doc.subject, doc.content,
        )
        elapsed = time.time() - start
        logger.info("Added document '%s' (%d chunks) in %.2fs", doc.topic_id, chunks_added, elapsed)
        return {
            "status": "created",
            "topic_id": doc.topic_id,
            "chunks": chunks_added,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Create document failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/documents/{topic_id}")
def update_document(topic_id: str, doc: DocumentRequest):
    start = time.time()
    try:
        removed = remove_topic_from_collection(topic_id)
        if removed == 0:
            logger.info("Topic '%s' did not exist, creating fresh", topic_id)

        chunks_added = add_topic_to_collection(
            doc.topic_id, doc.title, doc.subject, doc.content,
        )
        elapsed = time.time() - start
        logger.info(
            "Updated document '%s': removed %d old chunks, added %d new in %.2fs",
            topic_id, removed, chunks_added, elapsed,
        )
        return {
            "status": "updated",
            "topic_id": doc.topic_id,
            "chunks_removed": removed,
            "chunks_added": chunks_added,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Update document failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/documents/{topic_id}")
def delete_document(topic_id: str):
    start = time.time()
    try:
        removed = remove_topic_from_collection(topic_id)
        if removed == 0:
            raise HTTPException(status_code=404, detail=f"Topic '{topic_id}' not found")
        elapsed = time.time() - start
        logger.info("Deleted document '%s' (%d chunks) in %.2fs", topic_id, removed, elapsed)
        return {
            "status": "deleted",
            "topic_id": topic_id,
            "chunks_removed": removed,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Delete document failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


# ── Endpoints: File Processing ──────────────────────────────────────────────

@app.post("/process")
async def process_file(
    file: UploadFile = File(...),
    subject: str = Form(...),
    title: str = Form(default=""),
):
    start = time.time()
    try:
        content_type = detect_content_type(file.filename or "", file.content_type)
        extractor = EXTRACTORS[content_type]

        file_bytes = await file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        text = extractor(file_bytes)
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the file")

        topic_title = title or os.path.splitext(file.filename or "document")[0]
        topic_id = f"doc_{uuid.uuid4().hex[:12]}"

        chunks_added = add_topic_to_collection(topic_id, topic_title, subject, text)

        elapsed = time.time() - start
        logger.info(
            "Processed file '%s' → topic '%s' (%d chars, %d chunks) in %.2fs",
            file.filename, topic_id, len(text), chunks_added, elapsed,
        )
        return {
            "status": "processed",
            "topic_id": topic_id,
            "title": topic_title,
            "subject": subject,
            "characters": len(text),
            "chunks": chunks_added,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Process file failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))


# ── Endpoints: Query & Similar (existing) ───────────────────────────────────

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
