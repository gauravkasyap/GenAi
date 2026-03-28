from __future__ import annotations

from src.services.triage_service import analyze_case, hospital_search


def get_hospitals(query: dict[str, list[str]]) -> dict:
    language = query.get("language", ["en"])[0]
    state = query.get("state", [None])[0]
    district = query.get("district", [None])[0]
    specialty = query.get("specialty", [None])[0]
    return hospital_search(state, district, specialty, language)


def post_analyze(payload: dict) -> dict:
    return analyze_case(payload)
