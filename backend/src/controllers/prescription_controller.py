from __future__ import annotations

from src.services.prescription_service import explain_prescription


def post_explain_prescription(payload: dict) -> dict:
    return explain_prescription(
        payload.get("text", ""),
        payload.get("language", "en"),
        attachment=payload.get("attachment"),
    )
