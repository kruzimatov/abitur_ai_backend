from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = chromadb.PersistentClient(path="./vectorstore")
collection = client.get_or_create_collection("dtm_topics")


class SeedData(BaseModel):
    topics: list


class Query(BaseModel):
    question: str
    n_results: int = 3


@app.post("/seed")
def seed(data: SeedData):
    existing_ids = collection.get()["ids"]
    if existing_ids:
        collection.delete(ids=existing_ids)

    collection.add(
        documents=[t["content"] for t in data.topics],
        metadatas=[{"title": t["title"], "subject": t["subject"]} for t in data.topics],
        ids=[t.get("id", f"topic_{i}") for i, t in enumerate(data.topics)],
    )
    return {"status": "seeded", "count": len(data.topics)}


@app.post("/query")
def query(q: Query):
    count = collection.count()
    if count == 0:
        return {"chunks": [], "titles": []}

    results = collection.query(
        query_texts=[q.question],
        n_results=min(q.n_results, count),
    )
    return {
        "chunks": results["documents"][0],
        "titles": [m["title"] for m in results["metadatas"][0]],
    }


@app.get("/health")
def health():
    return {"status": "ok", "documents": collection.count()}
