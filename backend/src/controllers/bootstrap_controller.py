from __future__ import annotations

from src.services.llm_triage_service import llm_runtime_status
from src.services.triage_service import bootstrap_payload


def get_bootstrap(_: dict[str, list[str]]) -> dict:
    return bootstrap_payload()


def get_health(_: dict[str, list[str]]) -> dict:
    return {"status": "ok", "analysis": llm_runtime_status()}
