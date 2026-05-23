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

### `POST /process`

Upload a file (PDF, DOCX, or TXT) and automatically extract text, chunk it, and add to the vectorstore. This is the main endpoint for when a teacher/admin uploads a full book or document.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | file | yes | PDF, DOCX, or TXT file |
| `subject` | string | yes | Subject name (e.g., "Matematika") |
| `title` | string | no | Document title (defaults to filename) |

```bash
curl -X POST http://localhost:8001/process \
  -F "file=@algebra_textbook.pdf" \
  -F "subject=Matematika" \
  -F "title=Algebra — To'liq darslik"
```

**Response:**
```json
{
  "status": "processed",
  "topic_id": "doc_a1b2c3d4e5f6",
  "title": "Algebra — To'liq darslik",
  "subject": "Matematika",
  "characters": 45200,
  "chunks": 98
}
```

### `POST /documents`

Add a single topic to the vectorstore without replacing existing data.

**Request:**
```json
{
  "topic_id": "topic_8",
  "title": "Trigonometriya",
  "subject": "Matematika",
  "content": "Full topic text..."
}
```

**Response:**
```json
{
  "status": "created",
  "topic_id": "topic_8",
  "chunks": 4
}
```

### `PUT /documents/{topic_id}`

Update an existing topic (removes old chunks, adds new ones).

**Request:**
```json
{
  "topic_id": "topic_8",
  "title": "Trigonometriya (yangilangan)",
  "subject": "Matematika",
  "content": "Updated topic text..."
}
```

**Response:**
```json
{
  "status": "updated",
  "topic_id": "topic_8",
  "chunks_removed": 4,
  "chunks_added": 5
}
```

### `DELETE /documents/{topic_id}`

Remove a topic and all its chunks from the vectorstore.

**Response:**
```json
{
  "status": "deleted",
  "topic_id": "topic_8",
  "chunks_removed": 4
}
```

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
