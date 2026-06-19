from __future__ import annotations

from src.config.database import check_database_connection
from src.services.llm_triage_service import llm_runtime_status
from src.services.triage_service import bootstrap_payload


def get_bootstrap(_: dict[str, list[str]]) -> dict:
    return bootstrap_payload()


def get_health(_: dict[str, list[str]]) -> dict:
    database = check_database_connection()
    return {
        "status": "ok" if database["status"] == "ok" else "degraded",
        "analysis": llm_runtime_status(),
        "database": database,
    }
