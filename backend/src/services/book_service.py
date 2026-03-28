from __future__ import annotations

import base64
import binascii
import io
import re
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

try:
    import fitz  # PyMuPDF
except Exception:  # pragma: no cover - runtime dependency check
    fitz = None

SESSION_BOOKS: dict[str, list[dict[str, Any]]] = {}
BOOK_TEXT_DISCLAIMER = "This information is based on the provided medical text and is not a confirmed diagnosis."
BOOK_SAFETY_NOTE = "For diagnoses, medication changes, or dosing decisions, please consult a qualified clinician."
MAX_FILE_BYTES = 12 * 1024 * 1024
CHUNK_SIZE = 1200
CHUNK_OVERLAP = 180
STOPWORDS = {
    "the", "and", "for", "with", "from", "what", "when", "where", "which", "that", "this", "have", "about",
    "into", "would", "could", "should", "there", "their", "your", "please", "tell", "does", "doing", "being",
    "medical", "book", "text", "provided", "based", "patient", "disease", "symptom", "symptoms", "how", "can",
    "you", "are", "was", "were", "been", "will", "just", "than", "then", "them", "they", "also", "more",
    "safe", "safety", "children", "child", "adult", "medicine", "medication",
}
MEDICATION_QUERY_TOKENS = {"dose", "dosage", "tablet", "medicine", "medication", "drug", "paracetamol", "ibuprofen", "antibiotic", "diagnosis", "treatment"}
TRUSTED_SOURCES = {
    "who": "World Health Organization (WHO)",
    "world health organization": "World Health Organization (WHO)",
    "cdc": "Centers for Disease Control and Prevention (CDC)",
    "centers for disease control": "Centers for Disease Control and Prevention (CDC)",
    "nih": "National Institutes of Health (NIH)",
    "national institutes of health": "National Institutes of Health (NIH)",
    "elsevier": "Elsevier",
    "springer": "Springer",
    "oxford university press": "Oxford University Press",
    "oxford": "Oxford University Press",
    "cambridge university press": "Cambridge University Press",
    "bmj": "BMJ",
    "thelancet": "The Lancet",
    "the lancet": "The Lancet",
    "nejm": "New England Journal of Medicine",
    "new england journal of medicine": "New England Journal of Medicine",
    "aiims": "All India Institute of Medical Sciences (AIIMS)",
    "icmr": "Indian Council of Medical Research (ICMR)",
    "mayo clinic": "Mayo Clinic",
    "johns hopkins": "Johns Hopkins",
    "harvard medical school": "Harvard Medical School",
}


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _session_key(value: str | None) -> str:
    normalized = (value or "guest").strip().lower()
    return normalized or "guest"


def _public_book(book: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": book["id"],
        "name": book["name"],
        "sourceLabel": book.get("sourceLabel") or "Source not provided",
        "sourceStatus": book["sourceStatus"],
        "sourceReason": book["sourceReason"],
        "requiresConfirmation": book["requiresConfirmation"],
        "confirmed": book["confirmed"],
        "pageCount": book.get("pageCount", 0),
        "charCount": book.get("charCount", 0),
        "preview": book.get("preview", ""),
        "uploadedAt": book.get("uploadedAt"),
        "fileType": book.get("fileType"),
    }


def _clean_text(value: str) -> str:
    text = (value or "").replace("\x00", " ")
    text = text.replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def _normalize_for_match(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").lower()).strip()


def _decode_payload_bytes(payload: dict[str, Any]) -> bytes:
    encoded = payload.get("contentBase64")
    if not encoded:
        return b""
    raw = encoded.split(",", 1)[-1]
    try:
        data = base64.b64decode(raw)
    except (ValueError, binascii.Error) as exc:
        raise ValueError("Unable to decode the uploaded file.") from exc
    if len(data) > MAX_FILE_BYTES:
        raise ValueError("The uploaded file is too large for this demo workspace.")
    return data


def _extract_pdf_sections(data: bytes) -> tuple[list[dict[str, Any]], int, dict[str, str]]:
    if fitz is None:
        raise ValueError("PDF support is not available because PyMuPDF is not installed.")
    sections = []
    with fitz.open(stream=data, filetype="pdf") as document:
        metadata = {key: value for key, value in (document.metadata or {}).items() if value}
        for index, page in enumerate(document, start=1):
            text = _clean_text(page.get_text("text"))
            if text:
                sections.append({"label": f"Page {index}", "text": text, "page": index})
        return sections, document.page_count, metadata


def _extract_docx_sections(data: bytes) -> tuple[list[dict[str, Any]], int, dict[str, str]]:
    paragraphs: list[str] = []
    metadata: dict[str, str] = {}
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        document_xml = archive.read("word/document.xml")
        root = ET.fromstring(document_xml)
        namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        for paragraph in root.findall(".//w:p", namespace):
            parts = [node.text for node in paragraph.findall(".//w:t", namespace) if node.text]
            joined = _clean_text("".join(parts))
            if joined:
                paragraphs.append(joined)

        if "docProps/core.xml" in archive.namelist():
            core_root = ET.fromstring(archive.read("docProps/core.xml"))
            for node in core_root:
                if node.text:
                    metadata[node.tag.rsplit("}", 1)[-1]] = node.text.strip()

    text = "\n\n".join(paragraphs)
    sections = [{"label": "Document", "text": text, "page": None}] if text else []
    return sections, 1 if text else 0, metadata


def _extract_plain_text(data: bytes) -> tuple[list[dict[str, Any]], int, dict[str, str]]:
    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            text = data.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    else:
        raise ValueError("This file could not be read as text.")

    cleaned = _clean_text(text)
    sections = [{"label": "Document", "text": cleaned, "page": None}] if cleaned else []
    return sections, 1 if cleaned else 0, {}


def _extract_sections(file_name: str, mime_type: str | None, data: bytes, pasted_text: str | None) -> tuple[list[dict[str, Any]], int, dict[str, str], str]:
    extension = Path(file_name or "book.txt").suffix.lower()
    if pasted_text:
        cleaned = _clean_text(pasted_text)
        return ([{"label": "Provided text", "text": cleaned, "page": None}] if cleaned else []), 1 if cleaned else 0, {}, "text"
    if extension == ".pdf" or (mime_type or "").lower() == "application/pdf":
        sections, page_count, metadata = _extract_pdf_sections(data)
        return sections, page_count, metadata, "pdf"
    if extension == ".docx" or "wordprocessingml" in (mime_type or "").lower():
        sections, page_count, metadata = _extract_docx_sections(data)
        return sections, page_count, metadata, "docx"
    sections, page_count, metadata = _extract_plain_text(data)
    return sections, page_count, metadata, "text"


def _chunk_sections(sections: list[dict[str, Any]]) -> list[dict[str, Any]]:
    chunks: list[dict[str, Any]] = []
    for section_index, section in enumerate(sections, start=1):
        text = _clean_text(section.get("text", ""))
        if not text:
            continue
        start = 0
        part = 1
        while start < len(text):
            stop = min(start + CHUNK_SIZE, len(text))
            snippet = text[start:stop].strip()
            if snippet:
                chunks.append(
                    {
                        "id": f"chunk-{section_index}-{part}",
                        "text": snippet,
                        "location": section.get("label") or f"Section {section_index}",
                        "page": section.get("page"),
                    }
                )
            if stop >= len(text):
                break
            start = max(stop - CHUNK_OVERLAP, 0)
            part += 1
    return chunks


def _detect_source(name: str, source_label: str, metadata: dict[str, str], sections: list[dict[str, Any]]) -> tuple[str, str]:
    metadata_blob = " ".join(metadata.values())
    preview_blob = " ".join(section.get("text", "") for section in sections[:2])[:5000]
    haystack = _normalize_for_match(" ".join([name, source_label, metadata_blob, preview_blob]))
    matches = []
    for token, label in TRUSTED_SOURCES.items():
        if token in haystack and label not in matches:
            matches.append(label)
    if matches:
        if len(matches) == 1:
            return "verified", f"Verified source signal detected: {matches[0]}."
        return "verified", f"Verified source signals detected: {', '.join(matches[:3])}."
    if source_label.strip():
        return "caution", "The stated source could not be verified automatically. Please review it before relying on the text."
    return "caution", "This source does not appear to be from a verified medical authority."


def _tokenize_question(question: str) -> list[str]:
    tokens = [token for token in re.findall(r"\b[\w-]+\b", question.lower()) if len(token) > 2]
    return [token for token in tokens if token not in STOPWORDS]


def _score_text(question: str, terms: list[str], text: str) -> int:
    normalized = _normalize_for_match(text)
    if not normalized:
        return 0
    score = 0
    if question and question in normalized:
        score += 20
    for term in terms:
        if term in normalized:
            score += 4 + normalized.count(term)
    for left, right in zip(terms, terms[1:], strict=False):
        phrase = f"{left} {right}"
        if phrase.strip() and phrase in normalized:
            score += 3
    return score


def _best_sentences(question: str, terms: list[str], chunks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    sentences: list[tuple[int, dict[str, Any]]] = []
    for chunk in chunks:
        for sentence in re.split(r"(?<=[.!?])\s+|\n+", chunk["text"]):
            cleaned = _clean_text(sentence)
            if len(cleaned) < 30:
                continue
            score = _score_text(question, terms, cleaned)
            if score:
                sentences.append((score, {"text": cleaned, "location": chunk["location"], "page": chunk.get("page")}))
    sentences.sort(key=lambda item: item[0], reverse=True)
    unique: list[dict[str, Any]] = []
    seen = set()
    for _, sentence in sentences:
        key = sentence["text"].lower()
        if key in seen:
            continue
        unique.append(sentence)
        seen.add(key)
        if len(unique) == 3:
            break
    return unique


def _build_answer_text(book_name: str, top_sentences: list[dict[str, Any]]) -> str:
    joined = " ".join(sentence["text"] for sentence in top_sentences[:2]).strip()
    if not joined:
        return "This information is not available in the uploaded medical book."
    return f'According to the provided medical book "{book_name}", {joined}'


def _needs_medication_safety_note(question: str) -> bool:
    lowered = question.lower()
    return any(token in lowered for token in MEDICATION_QUERY_TOKENS)


def list_books(user_key: str | None) -> dict[str, Any]:
    books = SESSION_BOOKS.get(_session_key(user_key), [])
    return {"books": [_public_book(book) for book in books]}


def upload_book(payload: dict[str, Any]) -> dict[str, Any]:
    user_key = _session_key(payload.get("userEmail"))
    file_name = (payload.get("name") or "Medical book").strip() or "Medical book"
    source_label = (payload.get("sourceLabel") or "").strip()
    mime_type = payload.get("mimeType") or ""
    pasted_text = payload.get("text") if isinstance(payload.get("text"), str) and payload.get("text", "").strip() else None
    file_bytes = _decode_payload_bytes(payload) if not pasted_text else b""

    if not pasted_text and not file_bytes:
        raise ValueError("Please upload a file or provide medical text.")

    sections, page_count, metadata, file_type = _extract_sections(file_name, mime_type, file_bytes, pasted_text)
    extracted_text = _clean_text("\n\n".join(section["text"] for section in sections if section.get("text")))
    if not extracted_text:
        raise ValueError("No readable text was found in the uploaded medical book.")

    source_status, source_reason = _detect_source(file_name, source_label, metadata, sections)
    chunks = _chunk_sections(sections)
    preview = _clean_text(extracted_text[:260])
    book = {
        "id": f"book-{uuid.uuid4().hex[:10]}",
        "name": file_name,
        "sourceLabel": source_label or metadata.get("author") or metadata.get("creator") or metadata.get("producer") or "Source not provided",
        "sourceStatus": source_status,
        "sourceReason": source_reason,
        "requiresConfirmation": source_status != "verified",
        "confirmed": source_status == "verified",
        "uploadedAt": _utc_now(),
        "pageCount": page_count,
        "charCount": len(extracted_text),
        "preview": preview,
        "fileType": file_type,
        "metadata": metadata,
        "chunks": chunks,
        "text": extracted_text,
    }

    SESSION_BOOKS.setdefault(user_key, [])
    SESSION_BOOKS[user_key] = [book, *[existing for existing in SESSION_BOOKS[user_key] if existing["id"] != book["id"]]][:8]

    response = {
        "book": _public_book(book),
        "books": [_public_book(item) for item in SESSION_BOOKS[user_key]],
        "warning": None,
    }
    if book["requiresConfirmation"]:
        response["warning"] = "This source does not appear to be from a verified medical authority. Would you like me to proceed with caution?"
    return response


def remove_book(payload: dict[str, Any]) -> dict[str, Any]:
    user_key = _session_key(payload.get("userEmail"))
    book_id = payload.get("bookId")
    books = SESSION_BOOKS.get(user_key, [])
    SESSION_BOOKS[user_key] = [book for book in books if book["id"] != book_id]
    return {"books": [_public_book(book) for book in SESSION_BOOKS.get(user_key, [])]}


def confirm_book(payload: dict[str, Any]) -> dict[str, Any]:
    user_key = _session_key(payload.get("userEmail"))
    book_id = payload.get("bookId")
    for book in SESSION_BOOKS.get(user_key, []):
        if book["id"] == book_id:
            book["confirmed"] = True
            return {"book": _public_book(book), "books": [_public_book(item) for item in SESSION_BOOKS.get(user_key, [])]}
    raise ValueError("The selected medical book could not be found.")


def _selected_book(user_key: str, book_id: str | None) -> dict[str, Any] | None:
    books = SESSION_BOOKS.get(user_key, [])
    if book_id:
        for book in books:
            if book["id"] == book_id:
                return book
    return books[0] if books else None


def query_book(payload: dict[str, Any]) -> dict[str, Any]:
    user_key = _session_key(payload.get("userEmail"))
    question = _clean_text(payload.get("question", ""))
    if not question:
        raise ValueError("Please enter a question for the medical book.")

    book = _selected_book(user_key, payload.get("bookId"))
    if not book:
        return {
            "status": "no_book",
            "book": None,
            "answer": "Please upload a medical book before asking book-based questions.",
            "excerpts": [],
            "disclaimer": BOOK_TEXT_DISCLAIMER,
            "safetyNote": None,
        }

    if book["requiresConfirmation"] and not book["confirmed"]:
        return {
            "status": "requires_confirmation",
            "book": _public_book(book),
            "answer": "This source does not appear to be from a verified medical authority. Would you like me to proceed with caution?",
            "excerpts": [],
            "disclaimer": BOOK_TEXT_DISCLAIMER,
            "safetyNote": None,
        }

    normalized_question = _normalize_for_match(question)
    terms = _tokenize_question(question)
    ranked = []
    for chunk in book["chunks"]:
        score = _score_text(normalized_question, terms, chunk["text"])
        if score:
            ranked.append((score, chunk))
    ranked.sort(key=lambda item: item[0], reverse=True)
    top_chunks = [chunk for _, chunk in ranked[:4]]
    top_sentences = _best_sentences(normalized_question, terms, top_chunks)

    if not top_chunks or not top_sentences:
        return {
            "status": "not_found",
            "book": _public_book(book),
            "answer": "This information is not available in the uploaded medical book. Would you like me to answer based on general medical knowledge?",
            "excerpts": [],
            "disclaimer": BOOK_TEXT_DISCLAIMER,
            "safetyNote": BOOK_SAFETY_NOTE if _needs_medication_safety_note(question) else None,
        }

    excerpts = [
        {
            "location": sentence["location"],
            "page": sentence.get("page"),
            "text": sentence["text"],
        }
        for sentence in top_sentences
    ]
    answer = _build_answer_text(book["name"], top_sentences)

    return {
        "status": "found",
        "book": _public_book(book),
        "answer": answer,
        "excerpts": excerpts,
        "disclaimer": BOOK_TEXT_DISCLAIMER,
        "safetyNote": BOOK_SAFETY_NOTE if _needs_medication_safety_note(question) else None,
    }
