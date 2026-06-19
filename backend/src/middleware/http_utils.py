from __future__ import annotations

import json
import mimetypes
from http import HTTPStatus
from pathlib import Path

from src.config.settings import CORS_ALLOWED_ORIGINS


def send_cors_headers(handler) -> None:
    origin = handler.headers.get("Origin")
    if not origin or origin not in CORS_ALLOWED_ORIGINS:
        return

    handler.send_header("Access-Control-Allow-Origin", origin)
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    handler.send_header("Access-Control-Max-Age", "86400")
    handler.send_header("Vary", "Origin")


def read_json(handler) -> dict:
    length = int(handler.headers.get("Content-Length", "0"))
    raw = handler.rfile.read(length) if length else b"{}"
    try:
        return json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return {}


def send_json(handler, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    send_cors_headers(handler)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(data)))
    handler.send_header("Cache-Control", "no-cache")
    handler.end_headers()
    handler.wfile.write(data)


def serve_static(handler, request_path: str, static_root: Path) -> None:
    relative = request_path.lstrip("/") or "index.html"
    file_path = (static_root / relative).resolve()

    if file_path.is_dir():
        file_path = file_path / "index.html"

    if static_root not in file_path.parents and file_path != static_root / "index.html":
        handler.send_error(HTTPStatus.FORBIDDEN, "Forbidden")
        return

    if not file_path.exists():
        file_path = static_root / "index.html"

    try:
        data = file_path.read_bytes()
    except OSError:
        handler.send_error(HTTPStatus.NOT_FOUND, "File not found")
        return

    content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
    if content_type.startswith("text/") or "javascript" in content_type or content_type == "application/json":
        content_type = f"{content_type}; charset=utf-8"

    handler.send_response(HTTPStatus.OK)
    send_cors_headers(handler)
    handler.send_header("Content-Type", content_type)
    handler.send_header("Cache-Control", "no-cache")
    handler.end_headers()
    handler.wfile.write(data)
