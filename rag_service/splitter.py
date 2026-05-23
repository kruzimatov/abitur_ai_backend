"""
Smart document splitter for DTM textbooks.

Detects chapters/sections in extracted text and splits into logical topics.
Two layers:
  1. Heuristic: pattern-based heading detection (free, instant)
  2. AI: Gemini generates proper titles (optional, needs API key)
"""

import logging
import os
import re
from dataclasses import dataclass, field

logger = logging.getLogger("rag_service")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# Minimum section length to keep (skip tiny fragments)
MIN_SECTION_CHARS = 80
# If no headings found, fall back to page-based splits of this size
FALLBACK_SPLIT_SIZE = 2000


@dataclass
class Section:
    title: str
    content: str
    index: int = 0


# ── Heading Detection Patterns ──────────────────────────────────────────────

# Uzbek textbook patterns
HEADING_PATTERNS = [
    # "1-BOB", "2-BOB", "I BOB", "II BOB"
    re.compile(r"^\s*(\d+|[IVXLC]+)\s*[-–—.]?\s*BOB\b.*", re.IGNORECASE),
    # "§1.", "§ 2.", "1-§", "2-§."
    re.compile(r"^\s*§\s*\d+.*|^\s*\d+\s*[-–—]\s*§.*"),
    # "MAVZU:", "MAVZU 1:", "1-MAVZU"
    re.compile(r"^\s*(\d+\s*[-–—.]?\s*)?MAVZU\b.*", re.IGNORECASE),
    # "1.1. Tezlik va tezlanish" — dot-numbered subsections
    re.compile(r"^\s*\d+\.\d+\.?\s+[A-ZА-ЯЎҚҒҲa-z].{3,40}$"),
    # "CHAPTER 1", "Chapter 1" (for English texts)
    re.compile(r"^\s*CHAPTER\s+\d+.*", re.IGNORECASE),
    # "Глава 1" (Russian)
    re.compile(r"^\s*ГЛАВА\s+\d+.*", re.IGNORECASE),
]


def is_heading(line: str) -> bool:
    """Check if a line looks like a section heading."""
    stripped = line.strip()
    if not stripped or len(stripped) < 3:
        return False

    # ALL CAPS line (at least 5 chars, not a formula)
    if (
        len(stripped) >= 5
        and stripped == stripped.upper()
        and re.search(r"[A-ZА-ЯЎҚҒҲa-z]", stripped, re.IGNORECASE)
        and not stripped.endswith(".")
        and len(stripped) < 120
        and not re.search(r"[=<>≥≤±∑∫√]", stripped)
    ):
        return True

    # Check against known patterns
    for pattern in HEADING_PATTERNS:
        if pattern.match(stripped):
            return True

    return False


def clean_title(raw: str) -> str:
    """Clean up a detected heading into a usable title."""
    title = raw.strip()
    # Remove leading/trailing special chars
    title = re.sub(r"^[\s\-–—:§.]+|[\s\-–—:.]+$", "", title)
    # Collapse whitespace
    title = re.sub(r"\s+", " ", title)
    # Cap length
    if len(title) > 100:
        title = title[:97] + "..."
    return title


# ── Heuristic Splitter ──────────────────────────────────────────────────────

def split_by_headings(text: str) -> list[Section]:
    """Split text into sections based on detected headings."""
    lines = text.split("\n")
    sections: list[Section] = []
    current_title = ""
    current_lines: list[str] = []
    section_idx = 0

    for line in lines:
        if is_heading(line) and current_lines:
            # Save previous section
            content = "\n".join(current_lines).strip()
            if len(content) >= MIN_SECTION_CHARS:
                sections.append(Section(
                    title=clean_title(current_title) if current_title else f"Bo'lim {section_idx + 1}",
                    content=content,
                    index=section_idx,
                ))
                section_idx += 1
            current_title = line.strip()
            current_lines = []
        elif is_heading(line) and not current_lines:
            # First heading or consecutive headings
            current_title = line.strip()
        else:
            current_lines.append(line)

    # Don't forget the last section
    if current_lines:
        content = "\n".join(current_lines).strip()
        if len(content) >= MIN_SECTION_CHARS:
            sections.append(Section(
                title=clean_title(current_title) if current_title else f"Bo'lim {section_idx + 1}",
                content=content,
                index=section_idx,
            ))

    return sections


def split_by_size(text: str, max_size: int = FALLBACK_SPLIT_SIZE) -> list[Section]:
    """Fallback: split by paragraph groups when no headings detected."""
    paragraphs = re.split(r"\n\s*\n", text)
    sections: list[Section] = []
    current_chunk: list[str] = []
    current_len = 0
    section_idx = 0

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        if current_len + len(para) > max_size and current_chunk:
            content = "\n\n".join(current_chunk)
            sections.append(Section(
                title=f"Bo'lim {section_idx + 1}",
                content=content,
                index=section_idx,
            ))
            section_idx += 1
            current_chunk = []
            current_len = 0

        current_chunk.append(para)
        current_len += len(para)

    if current_chunk:
        content = "\n\n".join(current_chunk)
        if len(content) >= MIN_SECTION_CHARS:
            sections.append(Section(
                title=f"Bo'lim {section_idx + 1}",
                content=content,
                index=section_idx,
            ))

    return sections


# ── AI Title Generation ─────────────────────────────────────────────────────

def generate_titles_with_gemini(sections: list[Section], subject: str) -> list[Section]:
    """Use Gemini to generate proper titles for sections that have generic ones."""
    if not GEMINI_API_KEY:
        logger.info("No GEMINI_API_KEY set, skipping AI title generation")
        return sections

    # Only process sections with generic titles
    needs_titles = [
        (i, s) for i, s in enumerate(sections)
        if s.title.startswith("Bo'lim ") or len(s.title) < 5
    ]

    if not needs_titles:
        logger.info("All sections already have proper titles, skipping Gemini")
        return sections

    try:
        import httpx

        # Build prompt with first 200 chars of each section
        section_previews = []
        for idx, (i, s) in enumerate(needs_titles):
            preview = s.content[:200].replace("\n", " ")
            section_previews.append(f"{idx + 1}. {preview}")

        prompt = f"""Sen DTM o'quv materiallarini tahlil qiluvchi AI san.
Quyidagi {subject} fani bo'limlarining har biriga qisqa, aniq sarlavha (title) yoz.
Sarlavha o'zbek tilida, 5-10 so'zdan iborat bo'lsin.
Faqat JSON array qaytaring, boshqa hech narsa yozmang.

Bo'limlar:
{chr(10).join(section_previews)}

Javob formati (faqat JSON):
["Sarlavha 1", "Sarlavha 2", ...]"""

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json"},
        }

        resp = httpx.post(url, json=payload, timeout=30.0)
        resp.raise_for_status()

        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        import json
        titles = json.loads(text)

        if isinstance(titles, list) and len(titles) == len(needs_titles):
            for (i, _section), new_title in zip(needs_titles, titles):
                if isinstance(new_title, str) and new_title.strip():
                    sections[i].title = new_title.strip()
            logger.info("Gemini generated %d titles", len(titles))
        else:
            logger.warning("Gemini returned unexpected format, keeping original titles")

    except Exception as e:
        logger.warning("Gemini title generation failed (non-critical): %s", e)

    return sections


# ── Main Entry Point ────────────────────────────────────────────────────────

def split_document(text: str, subject: str, use_ai: bool = True) -> list[Section]:
    """
    Split a document into logical sections.

    1. Try heading-based splitting
    2. Fall back to size-based splitting if no headings found
    3. Optionally use Gemini to generate better titles
    """
    # Try heading-based first
    sections = split_by_headings(text)

    if len(sections) <= 1:
        # No headings detected, fall back to size-based
        logger.info("No headings detected, falling back to paragraph-based splitting")
        sections = split_by_size(text)

    if not sections:
        # Edge case: very short document
        sections = [Section(title="Hujjat", content=text.strip(), index=0)]

    logger.info("Split document into %d sections (method: %s)",
                len(sections),
                "headings" if any(not s.title.startswith("Bo'lim") for s in sections) else "size-based")

    # AI title generation
    if use_ai and GEMINI_API_KEY:
        sections = generate_titles_with_gemini(sections, subject)

    return sections
