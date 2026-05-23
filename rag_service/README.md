# AbiturAI RAG Service

Retrieval-Augmented Generation (RAG) microservice for the AbiturAI DTM exam preparation platform. Built with FastAPI and ChromaDB.

## Setup

### Prerequisites

- Python 3.11+
- pip

### Install

```bash
cd rag_service
pip install -r requirements.txt
```

### Run

```bash
uvicorn main:app --port 8001 --reload
```

### Seed the Vectorstore

The RAG service must be running before seeding:

```bash
python seed.py
```

Custom seed file or RAG URL:

```bash
python seed.py --file path/to/data.json --url http://localhost:8001
```

## Docker

```bash
cd rag_service
docker compose up --build
```

Then seed from outside the container:

```bash
python seed.py --url http://localhost:8001
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CHROMA_PATH` | `./vectorstore` | Path to ChromaDB persistent storage |

## API Endpoints

### `GET /health`

Health check with document count and available subjects.

**Response:**
```json
{
  "status": "ok",
  "documents": 15,
  "subjects": ["Fizika", "Kimyo", "Matematika"]
}
```

### `POST /seed`

Replace all vectorstore data with new topics. Topics are automatically chunked (500 chars, 50 char overlap).

**Request:**
```json
{
  "topics": [
    {
      "id": "topic_1",
      "title": "Logarifm",
      "subject": "Matematika",
      "content": "Full topic text..."
    }
  ]
}
```

**Response:**
```json
{
  "status": "seeded",
  "topics": 7,
  "chunks": 15
}
```

### `POST /query`

Retrieve relevant chunks for a question. Optionally filter by subject.

**Request:**
```json
{
  "question": "Logarifm nima?",
  "subject": "Matematika",
  "n_results": 3
}
```

**Response:**
```json
{
  "results": ["chunk text 1", "chunk text 2"],
  "sources": [
    {"document": "Logarifm — Asosiy tushunchalar", "section": "LOGARIFM — KIRISH VA ASOSIY XOSSALAR..."}
  ],
  "chunks": ["chunk text 1", "chunk text 2"],
  "titles": ["Logarifm — Asosiy tushunchalar", "Logarifm — Tenglamalar"]
}
```

- `results` + `sources`: new structured format
- `chunks` + `titles`: backward-compatible format for existing Laravel TutorController

### `POST /similar`

Find topics similar to a given topic or text. Used for student recommendations.

**Request (by topic ID):**
```json
{
  "topic_id": "topic_1",
  "n_results": 3
}
```

**Request (by text):**
```json
{
  "text": "kinematika formulalari",
  "n_results": 3
}
```

**Response:**
```json
{
  "topics": [
    {"id": "topic_2", "title": "Logarifm — Tenglamalar", "subject": "Matematika"}
  ]
}
```

## Integration with Laravel

The Laravel backend calls this service via `RagService.php`. Default URL: `http://localhost:8001`.

Configure in Laravel's `.env`:
```
RAG_SERVICE_URL=http://localhost:8001
```
