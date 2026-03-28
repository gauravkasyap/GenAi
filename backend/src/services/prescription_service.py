"""Prescription text parser for the MVP."""

from __future__ import annotations

import re

from src.services.localization_service import copy_for


ABBREVIATIONS = ("OD", "BD", "BID", "TDS", "TID", "QID", "HS", "SOS", "AC", "PC", "STAT")
MEAL_TOKENS = {
    "before food": "before_food",
    "after food": "after_food",
    "with food": "with_food",
    "bedtime": "bedtime",
}


def parse_schedule(line: str) -> tuple[str | None, list[str]]:
    match = re.search(r"\b([0-3])\s*-\s*([0-3])\s*-\s*([0-3])\b", line)
    if not match:
        return None, []

    schedule = match.group(0)
    times = []
    values = [int(match.group(1)), int(match.group(2)), int(match.group(3))]
    labels = ["morning", "afternoon", "night"]
    for value, label in zip(values, labels, strict=True):
        if value > 0:
            times.append(label)
    return schedule, times


def parse_duration(line: str) -> int | None:
    match = re.search(r"\b(?:x|for)\s*(\d+)\s*(?:day|days|d)\b", line, re.IGNORECASE)
    return int(match.group(1)) if match else None


def parse_abbreviations(line: str) -> list[str]:
    found = []
    for abbr in ABBREVIATIONS:
        if re.search(rf"\b{abbr}\b", line, re.IGNORECASE):
            found.append(abbr.upper())
    return found


def parse_meal_relation(line: str) -> str | None:
    lowered = line.lower()
    for token, label in MEAL_TOKENS.items():
        if token in lowered:
            return label
    if re.search(r"\bAC\b", line, re.IGNORECASE):
        return "before_food"
    if re.search(r"\bPC\b", line, re.IGNORECASE):
        return "after_food"
    if re.search(r"\bHS\b", line, re.IGNORECASE):
        return "bedtime"
    return None


def extract_medicine_name(line: str) -> str:
    cleaned = re.sub(r"\b(?:OD|BD|BID|TDS|TID|QID|HS|SOS|AC|PC|STAT)\b", "", line, flags=re.IGNORECASE)
    cleaned = re.sub(r"\b(?:x|for)\s*\d+\s*(?:day|days|d)\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\b[0-3]\s*-\s*[0-3]\s*-\s*[0-3]\b", "", cleaned)
    cleaned = re.sub(r"\b(?:before food|after food|with food|bedtime)\b", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s{2,}", " ", cleaned).strip(" -,:")
    return cleaned or "Medicine name unclear"


def explain_prescription(text: str, language: str = "en") -> dict:
    copy = copy_for(language)["prescription"]
    lines = [line.strip(" -•\t") for line in text.splitlines() if line.strip()]
    parsed_lines = []
    seen_abbr = set()

    for raw_line in lines:
        schedule, times = parse_schedule(raw_line)
        abbreviations = parse_abbreviations(raw_line)
        seen_abbr.update(abbreviations)
        meal_relation = parse_meal_relation(raw_line)
        duration_days = parse_duration(raw_line)
        medicine = extract_medicine_name(raw_line)

        parsed_lines.append(
            {
                "raw": raw_line,
                "medicine": medicine,
                "schedule": schedule,
                "times": times,
                "abbreviations": abbreviations,
                "mealRelation": meal_relation,
                "durationDays": duration_days,
                "display": {
                    "times": [copy["time_of_day"][time] for time in times],
                    "mealRelation": copy["meal_relations"].get(meal_relation) if meal_relation else None,
                    "abbreviations": [copy["abbr_meanings"][abbr] for abbr in abbreviations if abbr in copy["abbr_meanings"]],
                },
            }
        )

    return {
        "lines": parsed_lines,
        "legend": [{"abbr": abbr, "meaning": copy["abbr_meanings"][abbr]} for abbr in sorted(seen_abbr) if abbr in copy["abbr_meanings"]],
        "warnings": [copy["warnings"]["not_diagnosis"], copy["warnings"]["unclear"]],
    }
