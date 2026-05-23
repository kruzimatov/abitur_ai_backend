"""
Run this once to seed the RAG vectorstore from seed_data.json

Usage:
    python seed.py
"""

import json
import httpx

with open("../backend/seed_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

topics = []
for subject in data["subjects"]:
    for topic in subject["topics"]:
        topics.append({
            "id": f"topic_{topic['order_num']}",
            "title": topic["title"],
            "subject": subject["name"],
            "content": topic["content"],
        })

response = httpx.post("http://127.0.0.1:8001/seed", json={"topics": topics})
print(response.json())
