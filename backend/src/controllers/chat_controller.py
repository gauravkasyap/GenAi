from __future__ import annotations

from src.services.llm_triage_service import answer_general_question


def post_chat(payload: dict) -> dict:
    return answer_general_question(payload)
