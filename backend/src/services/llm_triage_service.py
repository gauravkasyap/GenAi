"""Optional LLM-backed illness explanation service."""

from __future__ import annotations

import json
import re
from urllib import request

from src.config.settings import (
    APP_DEBUG,
    GROQ_API_KEY,
    GROQ_MODEL,
    LLM_PROVIDER,
    LLM_TIMEOUT_SECONDS,
    OPENAI_API_KEY,
    OPENAI_MODEL,
)
from src.data.domain_data import LANGUAGES, PERSONAS, SYMPTOMS


LANGUAGE_LABELS = {item["code"]: item["label"] for item in LANGUAGES}
PERSONA_LABELS = {
    item["id"]: item.get("labels", {}).get("en", item["id"].replace("_", " ").title())
    for item in PERSONAS
}
SYMPTOM_LABELS = {
    item["id"]: item.get("labels", {}).get("en", item["id"].replace("_", " ").title())
    for item in SYMPTOMS
}

PROVIDER_CONFIG = {
    "openai": {
        "url": "https://api.openai.com/v1/chat/completions",
        "api_key": lambda: OPENAI_API_KEY,
        "model": lambda: OPENAI_MODEL,
        "label": "OpenAI",
    },
    "groq": {
        "url": "https://api.groq.com/openai/v1/chat/completions",
        "api_key": lambda: GROQ_API_KEY,
        "model": lambda: GROQ_MODEL,
        "label": "Groq",
    },
}


def active_llm_provider() -> str | None:
    preference = (LLM_PROVIDER or "auto").strip().lower()
    if preference == "off":
        return None

    if preference in PROVIDER_CONFIG:
        return preference if PROVIDER_CONFIG[preference]["api_key"]() else None

    for provider in ("openai", "groq"):
        if PROVIDER_CONFIG[provider]["api_key"]():
            return provider
    return None


def llm_runtime_status() -> dict:
    active = active_llm_provider()
    return {
        "requestedProvider": LLM_PROVIDER,
        "activeProvider": active or "rule_based",
        "enabled": active is not None,
        "models": {
            "openai": OPENAI_MODEL,
            "groq": GROQ_MODEL,
        },
    }


def analyze_with_llm(payload: dict, detected_symptoms: set[str], fallback_display: dict) -> dict | None:
    provider = active_llm_provider()
    if not provider:
        return None

    try:
        response = _post_chat_completion(
            provider,
            _messages_for(payload, detected_symptoms, fallback_display),
        )
        content = _extract_message_text(response)
        parsed = _parse_json_object(content)
        normalized = _normalize_analysis(parsed, fallback_display)
        normalized["analysisSource"] = provider
        normalized["analysisProviderLabel"] = PROVIDER_CONFIG[provider]["label"]
        return normalized
    except Exception as exc:  # noqa: BLE001
        if APP_DEBUG:
            print(f"LLM analysis fallback engaged: {exc}")
        return None


def _messages_for(payload: dict, detected_symptoms: set[str], fallback_display: dict) -> list[dict]:
    language = (payload.get("language") or "en").split("-", 1)[0].lower()
    symptom_labels = [
        SYMPTOM_LABELS.get(item, item.replace("_", " "))
        for item in sorted(detected_symptoms)
    ]
    prompt_payload = {
        "target_language": {
            "code": language,
            "label": LANGUAGE_LABELS.get(language, "English"),
        },
        "persona": PERSONA_LABELS.get(payload.get("persona", "adult"), "Adult"),
        "duration": payload.get("duration", "today"),
        "intensity": payload.get("intensity", "mild"),
        "raw_user_description": payload.get("notes", ""),
        "detected_symptoms": symptom_labels,
        "rule_based_draft": {
            "possibleCondition": fallback_display.get("possibleCondition", ""),
            "illnessExplanation": fallback_display.get("illnessExplanation", ""),
            "commonSymptoms": fallback_display.get("commonSymptoms", []),
            "whenToSeekHelp": fallback_display.get("whenToSeekHelp", ""),
            "followUpQuestion": fallback_display.get("followUpQuestion", ""),
        },
        "response_rules": [
            "Do not provide a confirmed diagnosis.",
            "Do not prescribe medication.",
            "Use simple, non-technical language.",
            "Return only a JSON object.",
            "Use a calm, doctor-like tone.",
        ],
    }
    return [
        {
            "role": "system",
            "content": (
                "You are a calm, safety-first medical explanation assistant inside a rural healthcare app. "
                "Given symptom details, produce a short structured explanation in the requested language. "
                "Return only valid JSON with these keys: possibleCondition, illnessExplanation, commonSymptoms, whenToSeekHelp, followUpQuestion. "
                "possibleCondition must not be a confirmed diagnosis and should use wording like 'This may be related to...' or 'A possible cause could be...'. "
                "commonSymptoms must be an array of 3 to 5 short symptom strings."
            ),
        },
        {
            "role": "user",
            "content": json.dumps(prompt_payload, ensure_ascii=False),
        },
    ]


def _post_chat_completion(provider: str, messages: list[dict]) -> dict:
    config = PROVIDER_CONFIG[provider]
    api_key = config["api_key"]()
    body = {
        "model": config["model"](),
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": messages,
    }
    payload = json.dumps(body).encode("utf-8")
    request_obj = request.Request(
        config["url"],
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with request.urlopen(request_obj, timeout=LLM_TIMEOUT_SECONDS) as response:  # noqa: S310
        return json.loads(response.read().decode("utf-8"))


def _extract_message_text(response_payload: dict) -> str:
    choices = response_payload.get("choices") or []
    if not choices:
        raise ValueError("No model choices returned")

    message = choices[0].get("message") or {}
    content = message.get("content", "")
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict):
                text = item.get("text") or item.get("content") or ""
                if text:
                    parts.append(str(text))
        if parts:
            return "\n".join(parts)
    raise ValueError("No text content returned from model")


def _parse_json_object(text: str) -> dict:
    cleaned = (text or "").strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if not match:
            raise
        return json.loads(match.group(0))


def _normalize_analysis(parsed: dict, fallback_display: dict) -> dict:
    common_symptoms = parsed.get("commonSymptoms") or parsed.get("common_symptoms")
    if isinstance(common_symptoms, str):
        common_symptoms = [
            line.strip(" -?	")
            for line in common_symptoms.splitlines()
            if line.strip(" -?	")
        ]
    if not isinstance(common_symptoms, list):
        common_symptoms = []

    normalized_symptoms = [
        _clean_text(item)
        for item in common_symptoms
        if isinstance(item, str) and _clean_text(item)
    ][:5]
    if len(normalized_symptoms) < 3:
        normalized_symptoms = list(fallback_display.get("commonSymptoms", []))

    return {
        "possibleCondition": _clean_text(
            parsed.get("possibleCondition") or parsed.get("possible_condition")
        ) or fallback_display.get("possibleCondition", ""),
        "illnessExplanation": _clean_text(
            parsed.get("illnessExplanation") or parsed.get("explanation")
        ) or fallback_display.get("illnessExplanation", ""),
        "commonSymptoms": normalized_symptoms,
        "whenToSeekHelp": _clean_text(
            parsed.get("whenToSeekHelp") or parsed.get("when_to_seek_help")
        ) or fallback_display.get("whenToSeekHelp", ""),
        "followUpQuestion": _clean_text(
            parsed.get("followUpQuestion") or parsed.get("follow_up_question")
        ) or fallback_display.get("followUpQuestion", ""),
    }


def _clean_text(value: object) -> str:
    if not isinstance(value, str):
        return ""
    return " ".join(value.strip().split())
