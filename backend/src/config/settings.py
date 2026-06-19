from __future__ import annotations

import os
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_ROOT / ".env"


def _load_env_file(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if not key or key in os.environ:
            continue
        if value and value[0] == value[-1] and value[0] in {'"', "'"}:
            value = value[1:-1]
        os.environ[key] = value


_load_env_file(ENV_FILE)

STATIC_ROOT = Path(os.environ.get("STATIC_DIR", BACKEND_ROOT / "static")).resolve()
HOST = os.environ.get("HOST", ""0.0.0.0"")
PORT = int(os.environ.get("PORT", "8000"))
APP_DEBUG = os.environ.get("APP_DEBUG", "false").strip().lower() in {"1", "true", "yes", "on"}
SERVER_NAME = os.environ.get("SERVER_NAME", "GenAi/0.2")
CORS_ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.environ.get(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174",
    ).split(",")
    if origin.strip()
}
MONGODB_URI = os.environ.get("MONGODB_URI", "").strip()
DATABASE_NAME = os.environ.get("DATABASE_NAME", "genai_db").strip()

LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "auto").strip().lower()
OPENAI_API_KEY = (os.environ.get("OPENAI_API_KEY") or os.environ.get("OPEN_API_KEY") or "").strip()
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini").strip() or "gpt-4o-mini"
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile").strip() or "llama-3.3-70b-versatile"
LLM_TIMEOUT_SECONDS = float(os.environ.get("LLM_TIMEOUT_SECONDS", "20"))
