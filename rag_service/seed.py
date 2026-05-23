"""
Seed the RAG vectorstore from seed_data.json.

Usage:
    cd rag_service
    python seed.py                          # seeds from ../backend/seed_data.json
    python seed.py --file path/to/data.json # seeds from a custom file
"""

import argparse
import json
import sys

import httpx

DEFAULT_SEED_FILE = "../backend/seed_data.json"
RAG_URL = "http://127.0.0.1:8001"


def load_seed_data(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    subject_map = {s["id"]: s["name"] for s in data["subjects"]}

    topics = []
    for topic in data["topics"]:
        subject_name = subject_map.get(topic["subject_id"], "Noma'lum fan")
        topics.append({
            "id": f"topic_{topic['id']}",
            "title": topic["title"],
            "subject": subject_name,
            "content": topic["content"],
        })
    return topics


def seed(topics: list[dict], base_url: str = RAG_URL) -> dict:
    response = httpx.post(
        f"{base_url}/seed",
        json={"topics": topics},
        timeout=60.0,
    )
    response.raise_for_status()
    return response.json()


def main():
    parser = argparse.ArgumentParser(description="Seed the RAG vectorstore")
    parser.add_argument("--file", default=DEFAULT_SEED_FILE, help="Path to seed_data.json")
    parser.add_argument("--url", default=RAG_URL, help="RAG service base URL")
    args = parser.parse_args()

    try:
        topics = load_seed_data(args.file)
    except FileNotFoundError:
        print(f"ERROR: Seed file not found: {args.file}")
        sys.exit(1)

    print(f"Loaded {len(topics)} topics from {args.file}")
    for t in topics:
        print(f"  - [{t['subject']}] {t['title']} ({len(t['content'])} chars)")

    try:
        result = seed(topics, args.url)
        print(f"\nSeeded successfully: {result}")
    except httpx.ConnectError:
        print(f"\nERROR: Cannot connect to RAG service at {args.url}")
        print("Make sure the service is running: uvicorn main:app --port 8001")
        sys.exit(1)
    except httpx.HTTPStatusError as e:
        print(f"\nERROR: Seed request failed: {e.response.status_code} {e.response.text}")
        sys.exit(1)


if __name__ == "__main__":
    main()
