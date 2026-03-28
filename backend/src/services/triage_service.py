"""Rule-based triage engine for the healthcare assistant MVP."""

from __future__ import annotations

from collections import Counter

from src.data.domain_data import (
    FACILITY_LABELS,
    HOSPITALS,
    KNOWLEDGE_TOPICS,
    LANGUAGES,
    PERSONAS,
    SPECIALTY_LABELS,
    SYMPTOMS,
    states_and_districts,
)
from src.services.llm_triage_service import analyze_with_llm
from src.services.localization_service import copy_for


SYMPTOM_MAP = {symptom["id"]: symptom for symptom in SYMPTOMS}
DURATION_SCORE = {"today": 0, "1_3_days": 1, "4_7_days": 2, "more_than_week": 3}
STATE_DISTRICT_MAP = states_and_districts()
DISTRICT_STATE_MAP = {
    district: state
    for state, districts in STATE_DISTRICT_MAP.items()
    for district in districts
}
DEFAULT_LOCATION_BY_LANGUAGE = {
    "bn": ("West Bengal", "Purulia"),
    "mr": ("Maharashtra", "Nandurbar"),
    "ta": ("Tamil Nadu", "Dharmapuri"),
}
DOCTOR_LABELS = {
    "general_physician": "General Physician",
    "cardiologist": "Cardiologist",
    "dermatologist": "Dermatologist",
    "pediatrician": "Pediatrician",
    "obstetrician_gynecologist": "Obstetrician / Gynecologist",
    "emergency_physician": "Emergency Physician",
}
ANALYSIS_DISCLAIMER = "This is not a confirmed diagnosis. Please consult a qualified healthcare professional."
EXPLANATION_PROFILES = {
    "headache": {
        "possible_condition": "This may be related to a tension headache or a mild migraine.",
        "explanation": "Headaches can happen due to stress, dehydration, poor sleep, eye strain, or tight muscles around the head and neck.",
        "common_symptoms": [
            "Dull or throbbing head pain",
            "Pressure around the forehead or temples",
            "Sensitivity to light or sound",
            "Tiredness or mild nausea",
        ],
        "seek_help": "Seek medical attention if the headache is sudden and severe, keeps getting worse, lasts longer than expected, or happens with vomiting, weakness, confusion, or vision changes.",
    },
    "common_infection": {
        "possible_condition": "This may be related to a viral infection, seasonal flu, or another common infection.",
        "explanation": "These illnesses happen when germs enter the body and cause symptoms like fever, cough, body aches, or tiredness.",
        "common_symptoms": [
            "Fever or chills",
            "Cough or sore throat",
            "Body aches or tiredness",
            "Blocked nose or reduced appetite",
        ],
        "seek_help": "Seek medical attention if the fever is high or persistent, breathing becomes difficult, the person is very weak, or symptoms keep getting worse instead of improving.",
    },
    "stomach_or_dehydration": {
        "possible_condition": "A possible cause could be a stomach infection with dehydration.",
        "explanation": "Loose motions or vomiting can make the body lose water and salts quickly, which can lead to weakness and dizziness.",
        "common_symptoms": [
            "Loose motions or vomiting",
            "Stomach cramps",
            "Thirst or dry mouth",
            "Weakness or dizziness",
        ],
        "seek_help": "Seek medical attention if the person cannot keep fluids down, becomes very sleepy or confused, has blood in the stool, or the weakness keeps increasing.",
    },
    "skin_issue": {
        "possible_condition": "This may be related to a skin irritation, allergy, or mild skin infection.",
        "explanation": "Skin problems can happen due to allergy, sweating, insect bites, friction, or infections that irritate the skin.",
        "common_symptoms": [
            "Redness or rash",
            "Itching or burning",
            "Dry or swollen skin",
            "Mild pain or irritation",
        ],
        "seek_help": "Seek medical attention if the rash spreads quickly, becomes painful, starts oozing, or happens with fever, swelling, or trouble breathing.",
    },
    "high_blood_sugar": {
        "possible_condition": "This may be related to high blood sugar or a diabetes flare-up.",
        "explanation": "Blood sugar can rise when the body does not use insulin well, medicines are missed, or there is infection, stress, or dehydration.",
        "common_symptoms": [
            "More thirst than usual",
            "Frequent urination",
            "Tiredness or weakness",
            "Blurred vision or nausea",
        ],
        "seek_help": "Seek medical attention if sugar readings stay high, there is vomiting, drowsiness, confusion, fast breathing, or the person is getting weaker.",
    },
    "pregnancy_concern": {
        "possible_condition": "This may be related to a pregnancy-related problem that needs review.",
        "explanation": "Pain, bleeding, fever, or unusual weakness during pregnancy should be checked because both the mother and baby may need timely care.",
        "common_symptoms": [
            "Lower abdominal pain or cramps",
            "Bleeding or spotting",
            "Dizziness or weakness",
            "Reduced baby movement",
        ],
        "seek_help": "Seek medical attention urgently if there is heavy bleeding, severe pain, fever, fainting, or reduced baby movement.",
    },
    "injury": {
        "possible_condition": "This may be related to a sprain, strain, or another injury.",
        "explanation": "Pain after a fall, hit, or sudden twist often happens when muscles, joints, or soft tissue are strained or injured.",
        "common_symptoms": [
            "Pain or tenderness",
            "Swelling",
            "Difficulty moving the area",
            "Bruising or stiffness",
        ],
        "seek_help": "Seek medical attention if pain is severe, swelling keeps increasing, there is heavy bleeding, the person cannot move the area, or there may be a head injury.",
    },
    "heart_or_breathing": {
        "possible_condition": "This may be related to a breathing problem, severe acidity, or a heart-related issue.",
        "explanation": "Chest pain or breathlessness can happen when the heart, lungs, or airways are under stress, so these symptoms should be taken seriously.",
        "common_symptoms": [
            "Chest pain or pressure",
            "Shortness of breath",
            "Sweating or dizziness",
            "Fast heartbeat or unusual weakness",
        ],
        "seek_help": "Seek urgent medical attention if the pain is severe, spreads to the arm or jaw, breathing worsens, or the person feels faint, confused, or unable to speak clearly.",
    },
    "dizziness": {
        "possible_condition": "A possible cause could be dehydration, low food intake, low blood pressure, or another common illness.",
        "explanation": "Dizziness can happen when the body is tired, dehydrated, recovering from illness, or not getting enough rest or fluids.",
        "common_symptoms": [
            "Feeling light-headed",
            "Weakness or tiredness",
            "Blurred vision",
            "Unsteady walking or nausea",
        ],
        "seek_help": "Seek medical attention if dizziness is severe, keeps returning, causes falls, or happens with chest pain, weakness, fainting, or trouble speaking.",
    },
    "general_review": {
        "possible_condition": "A possible cause could be a mild infection, tiredness, dehydration, or another common health issue.",
        "explanation": "Many mild illnesses have overlapping symptoms, so the pattern should be monitored and checked if it does not improve.",
        "common_symptoms": [
            "Tiredness or weakness",
            "Body discomfort",
            "Reduced appetite",
            "Feeling generally unwell",
        ],
        "seek_help": "Seek medical attention if symptoms become severe, keep getting worse, or do not start improving over time.",
    },
}
FOLLOW_UP_QUESTIONS = {
    "default": "How are you feeling right now? Has your condition improved, worsened, or stayed the same?",
    "infection": "Are you also having chills, breathing trouble, vomiting, or any new symptoms right now?",
    "dehydration": "Are you able to drink fluids normally, or are you feeling weaker or dizzier than before?",
    "pregnancy": "Are you also having bleeding, severe pain, fever, or reduced baby movement right now?",
    "cardiac": "Are you having chest pressure, sweating, dizziness, or more trouble breathing right now?",
    "rash": "Is the rash spreading, becoming painful, or happening together with fever or swelling?",
    "headache": "How are you feeling now? Is the headache improving or getting worse?",
    "injury": "Is the pain getting worse, and can you move the injured area normally right now?",
    "sugar": "Have your sugar readings gone up, and are you having vomiting, drowsiness, or blurred vision?",
}
LOCATION_TEXTS = {
    "exact": "Showing nearby care options around {district}, {state}.",
    "mock": "Showing nearby care options around {district}, {state} as a mock location.",
}
SAME_DISTRICT_DISTANCES = [2.1, 5.4, 9.2, 13.7]
SAME_STATE_DISTANCES = [12.4, 19.8, 28.6, 37.1]
OTHER_DISTANCES = [31.2, 49.7, 68.3, 92.5]


def bootstrap_payload() -> dict:
    return {
        "languages": LANGUAGES,
        "personas": PERSONAS,
        "symptoms": SYMPTOMS,
        "states": STATE_DISTRICT_MAP,
        "knowledgeTopics": KNOWLEDGE_TOPICS,
        "specialties": SPECIALTY_LABELS,
        "facilityTypes": FACILITY_LABELS,
        "sampleHospitalCount": len(HOSPITALS),
    }


def detect_symptoms(notes: str, symptom_ids: list[str]) -> list[str]:
    found = set(symptom_ids)
    lowered = (notes or "").lower()
    for symptom in SYMPTOM_MAP.values():
        if any(keyword.lower() in lowered for keyword in symptom["keywords"]):
            found.add(symptom["id"])
    return sorted(found)


def infer_specialty(symptom_ids: list[str]) -> str:
    if not symptom_ids:
        return "general_medicine"
    counts = Counter(
        SYMPTOM_MAP[symptom_id]["specialty"]
        for symptom_id in symptom_ids
        if symptom_id in SYMPTOM_MAP
    )
    return counts.most_common(1)[0][0]


def cluster_for(symptoms: set[str], persona: str) -> str:
    if {"breathlessness", "chest_pain", "stroke_signs"} & symptoms:
        return "respiratory_distress"
    if persona == "pregnancy" and {"pregnancy_pain", "severe_bleeding"} & symptoms:
        return "pregnancy_warning"
    if {"diarrhea", "vomiting", "dehydration"} & symptoms:
        return "possible_dehydration"
    if {"injury", "headache"} & symptoms:
        return "injury_or_pain"
    if "high_sugar" in symptoms:
        return "metabolic_followup"
    if symptoms & {"fever", "cough", "rash"}:
        return "possible_infection"
    if symptoms:
        return "routine_review"
    return "mild_self_care"


def severity_level(symptoms: set[str], persona: str, duration: str, intensity: str, notes: str) -> str:
    lowered = (notes or "").lower()
    has_confusion = any(
        token in lowered
        for token in ["confusion", "unconscious", "faint", "fainted", "difficult to wake"]
    )

    if {"breathlessness", "chest_pain", "stroke_signs", "severe_bleeding"} & symptoms:
        return "emergency"
    if has_confusion:
        return "emergency"
    if persona == "pregnancy" and {"pregnancy_pain", "severe_bleeding"} & symptoms:
        return "emergency"
    if "injury" in symptoms and intensity == "severe":
        return "urgent"
    if {"diarrhea", "vomiting"} <= symptoms:
        return "urgent"
    if "dehydration" in symptoms and persona in {"child", "elderly"}:
        return "urgent"
    if "fever" in symptoms and DURATION_SCORE.get(duration, 0) >= 2:
        return "urgent"
    if {"fever", "cough"} <= symptoms and DURATION_SCORE.get(duration, 0) >= 1:
        return "urgent"
    if persona == "pregnancy" and "pregnancy_pain" in symptoms:
        return "urgent"
    if intensity == "severe":
        return "urgent"
    if symptoms & {"high_sugar", "rash", "headache", "dizziness"}:
        return "soon"
    if symptoms & {"fever", "cough", "vomiting", "diarrhea"}:
        return "soon"
    return "self_care"


def action_codes_for(level: str, symptoms: set[str]) -> list[str]:
    if level == "emergency":
        return ["call_108_or_112", "go_now", "do_not_delay", "carry_records"]
    if level == "urgent":
        actions = ["visit_today", "carry_records", "avoid_self_medicating", "ask_asha_for_help"]
        if {"diarrhea", "vomiting", "dehydration"} & symptoms:
            actions.insert(1, "fluids_if_alert")
        return actions
    if level == "soon":
        return ["book_within_24h", "note_vitals", "avoid_self_medicating", "ask_asha_for_help"]
    return ["rest_and_fluids", "monitor_24h", "avoid_self_medicating", "ask_asha_for_help"]


def care_codes_for(symptoms: set[str]) -> list[str]:
    care = ["hydration", "rest", "medicine_check"]
    if {"diarrhea", "vomiting"} & symptoms:
        care.append("ors")
    if {"fever", "cough"} & symptoms:
        care.append("isolate_mask")
    if symptoms:
        care.append("food_light")
    return list(dict.fromkeys(care))


def red_flag_codes_for(symptoms: set[str], persona: str) -> list[str]:
    flags = ["persistent_fever", "worse_breathing", "confusion", "can_not_drink"]
    if {"severe_bleeding", "injury"} & symptoms:
        flags.append("blood_loss")
    if {"stroke_signs", "chest_pain"} & symptoms:
        flags.extend(["one_sided_weakness", "severe_pain"])
    if persona == "pregnancy":
        flags.append("pregnancy_movement")
    return list(dict.fromkeys(flags))


def knowledge_topics_for(symptoms: set[str], level: str) -> list[dict]:
    related = []
    for topic in KNOWLEDGE_TOPICS:
        if any(tag in symptoms or tag == level or tag == "hospital" for tag in topic["tags"]):
            related.append(topic)
    if level == "emergency":
        emergency_topic = next(topic for topic in KNOWLEDGE_TOPICS if topic["id"] == "emergency_response")
        related.insert(0, emergency_topic)

    unique = []
    seen = set()
    for topic in related:
        if topic["id"] not in seen:
            unique.append(topic)
            seen.add(topic["id"])
    return unique[:4]


def resolve_location(language: str, state: str | None, district: str | None) -> dict:
    resolved_state = state
    resolved_district = district
    is_mock = False

    if resolved_district and not resolved_state:
        resolved_state = DISTRICT_STATE_MAP.get(resolved_district)

    if resolved_state and not resolved_district:
        districts = STATE_DISTRICT_MAP.get(resolved_state, [])
        if districts:
            resolved_district = districts[0]
            is_mock = True

    if not resolved_state or not resolved_district:
        fallback_state, fallback_district = DEFAULT_LOCATION_BY_LANGUAGE.get(language, ("Bihar", "Gaya"))
        resolved_state = resolved_state or fallback_state
        resolved_district = resolved_district or fallback_district
        is_mock = True

    return {
        "state": resolved_state,
        "district": resolved_district,
        "isMock": is_mock,
    }


def find_hospitals(
    state: str | None,
    district: str | None,
    specialty: str | None,
    level: str | None = None,
    limit: int = 4,
) -> list[dict]:
    ranked = []
    for hospital in HOSPITALS:
        score = 0
        if state and hospital["state"] == state:
            score += 4
        if district and hospital["district"] == district:
            score += 4
        if specialty and specialty in hospital["specialties"]:
            score += 3
        if level == "emergency" and hospital["type"] == "district_hospital":
            score += 2
        elif level in {"urgent", "soon"} and hospital["type"] in {"chc", "phc"}:
            score += 1
        ranked.append((score, hospital))
    ranked.sort(key=lambda item: (-item[0], item[1]["name"]))
    return [hospital for _, hospital in ranked[:limit]]


def distance_for(hospital: dict, location: dict, index: int) -> float:
    if hospital["district"] == location["district"]:
        palette = SAME_DISTRICT_DISTANCES
    elif hospital["state"] == location["state"]:
        palette = SAME_STATE_DISTANCES
    else:
        palette = OTHER_DISTANCES
    safe_index = min(index, len(palette) - 1)
    return palette[safe_index]


def localize_hospitals(hospitals: list[dict], language: str, location: dict | None = None) -> list[dict]:
    copy = copy_for(language)
    localized = []
    for index, hospital in enumerate(hospitals):
        item = {
            **hospital,
            "typeLabel": copy["facility_labels"].get(hospital["type"], hospital["type"]),
        }
        if location:
            distance_km = distance_for(hospital, location, index)
            item["distanceKm"] = distance_km
            item["distanceLabel"] = f"{distance_km:.1f} km"
        localized.append(item)
    return localized


def condition_profile_key_for(symptoms: set[str], persona: str, notes: str) -> str:
    lowered = (notes or "").lower()

    if {"chest_pain", "breathlessness", "stroke_signs"} & symptoms or any(
        token in lowered
        for token in ["chest pain", "breathing", "shortness of breath", "heart", "asthma"]
    ):
        return "heart_or_breathing"
    if persona == "pregnancy" or "pregnancy_pain" in symptoms or any(
        token in lowered for token in ["pregnan", "bleeding in pregnancy"]
    ):
        return "pregnancy_concern"
    if "rash" in symptoms or any(
        token in lowered for token in ["rash", "itch", "allergy", "eczema", "skin"]
    ):
        return "skin_issue"
    if {"diarrhea", "vomiting", "dehydration"} & symptoms or any(
        token in lowered
        for token in ["diarrhea", "diarrhoea", "loose motion", "vomit", "food poisoning", "stomach bug"]
    ):
        return "stomach_or_dehydration"
    if "high_sugar" in symptoms or any(
        token in lowered for token in ["diabetes", "high sugar", "blood sugar"]
    ):
        return "high_blood_sugar"
    if "injury" in symptoms or any(
        token in lowered for token in ["injury", "fall", "sprain", "strain", "twist"]
    ):
        return "injury"
    if "headache" in symptoms or any(
        token in lowered for token in ["headache", "migraine", "head pain"]
    ):
        return "headache"
    if {"fever", "cough"} & symptoms or "fever" in symptoms or "cough" in symptoms or any(
        token in lowered for token in ["fever", "cough", "flu", "viral", "cold", "infection"]
    ):
        return "common_infection"
    if "dizziness" in symptoms or any(
        token in lowered for token in ["dizzy", "dizziness", "light headed", "lightheaded"]
    ):
        return "dizziness"
    return "general_review"


def condition_profile_for(symptoms: set[str], persona: str, notes: str) -> dict:
    profile_key = condition_profile_key_for(symptoms, persona, notes)
    return {"key": profile_key, **EXPLANATION_PROFILES[profile_key]}


def doctor_code_for(symptoms: set[str], persona: str, level: str) -> str:
    if {"chest_pain", "breathlessness"} & symptoms:
        return "cardiologist"
    if "rash" in symptoms:
        return "dermatologist"
    if persona == "pregnancy" or "pregnancy_pain" in symptoms:
        return "obstetrician_gynecologist"
    if persona == "child":
        return "pediatrician"
    if level == "emergency" or {"stroke_signs", "injury", "severe_bleeding"} & symptoms:
        return "emergency_physician"
    return "general_physician"


def doctor_label_for(code: str, copy: dict) -> str:
    return copy.get("doctor_labels", {}).get(code, DOCTOR_LABELS.get(code, DOCTOR_LABELS["general_physician"]))


def follow_up_question_for(symptoms: set[str], persona: str, cluster: str, copy: dict) -> str:
    if {"chest_pain", "breathlessness"} & symptoms:
        question_code = "cardiac"
    elif "rash" in symptoms:
        question_code = "rash"
    elif persona == "pregnancy" or "pregnancy_pain" in symptoms:
        question_code = "pregnancy"
    elif {"diarrhea", "vomiting", "dehydration"} & symptoms:
        question_code = "dehydration"
    elif "high_sugar" in symptoms:
        question_code = "sugar"
    elif "headache" in symptoms:
        question_code = "headache"
    elif "injury" in symptoms:
        question_code = "injury"
    elif cluster == "possible_infection" or {"fever", "cough"} & symptoms:
        question_code = "infection"
    else:
        question_code = "default"
    return copy.get("follow_up_questions", {}).get(question_code, FOLLOW_UP_QUESTIONS[question_code])


def join_sentences(*parts: str) -> str:
    sentences = []
    for part in parts:
        sentence = (part or "").strip()
        if not sentence:
            continue
        if sentence[-1] not in ".!?":
            sentence = f"{sentence}."
        sentences.append(sentence)
    return " ".join(sentences)


def location_context_for(location: dict, copy: dict) -> dict:
    templates = copy.get("location_texts", {})
    key = "mock" if location["isMock"] else "exact"
    template = templates.get(key, LOCATION_TEXTS[key])
    label = template.format(district=location["district"], state=location["state"])
    return {
        **location,
        "label": label,
    }


def analyze_case(payload: dict) -> dict:
    language = payload.get("language", "en")
    persona = payload.get("persona", "adult")
    duration = payload.get("duration", "today")
    intensity = payload.get("intensity", "mild")
    notes = payload.get("notes", "")
    state = payload.get("state")
    district = payload.get("district")

    symptoms = set(detect_symptoms(notes, payload.get("symptoms", [])))
    level = severity_level(symptoms, persona, duration, intensity, notes)
    specialty = infer_specialty(list(symptoms))
    cluster = cluster_for(symptoms, persona)
    copy = copy_for(language)
    resolved_location = resolve_location(language, state, district)
    hospitals = find_hospitals(
        resolved_location["state"],
        resolved_location["district"],
        specialty,
        level,
        limit=3,
    )

    facility_type = hospitals[0]["type"] if hospitals else "phc"
    action_codes = action_codes_for(level, symptoms)
    care_codes = care_codes_for(symptoms)
    red_flag_codes = red_flag_codes_for(symptoms, persona)
    doctor_code = doctor_code_for(symptoms, persona, level)
    condition_profile = condition_profile_for(symptoms, persona, notes)
    location_context = location_context_for(resolved_location, copy)

    display = {
        "levelLabel": copy["level_labels"][level],
        "headline": copy["headlines"][cluster],
        "explanation": copy["level_explanations"][level],
        "possibleCondition": condition_profile["possible_condition"],
        "illnessExplanation": condition_profile["explanation"],
        "commonSymptoms": condition_profile["common_symptoms"],
        "whenToSeekHelp": condition_profile["seek_help"],
        "followUpQuestion": follow_up_question_for(symptoms, persona, cluster, copy),
        "doctorLabel": doctor_label_for(doctor_code, copy),
        "specialtyLabel": copy["specialty_labels"][specialty],
        "facilityLabel": copy["facility_labels"].get(
            facility_type,
            copy["facility_labels"]["phc"],
        ),
        "actionItems": [copy["action_texts"][code] for code in action_codes],
        "careItems": [copy["care_texts"][code] for code in care_codes],
        "redFlagItems": [copy["red_flag_texts"][code] for code in red_flag_codes],
        "disclaimer": ANALYSIS_DISCLAIMER,
    }

    llm_display = analyze_with_llm(payload, symptoms, display)
    analysis_source = "rule_based"
    if llm_display:
        display.update(
            {
                "possibleCondition": llm_display["possibleCondition"],
                "illnessExplanation": llm_display["illnessExplanation"],
                "commonSymptoms": llm_display["commonSymptoms"],
                "whenToSeekHelp": llm_display["whenToSeekHelp"],
                "followUpQuestion": llm_display["followUpQuestion"],
            }
        )
        analysis_source = llm_display.get("analysisSource", "rule_based")

    display["analysisSource"] = analysis_source

    return {
        "level": level,
        "headlineCode": cluster,
        "specialty": specialty,
        "doctorType": doctor_code,
        "persona": persona,
        "duration": duration,
        "intensity": intensity,
        "facilitySuggestion": facility_type,
        "symptomsDetected": sorted(symptoms),
        "actions": action_codes,
        "careTips": care_codes,
        "redFlags": red_flag_codes,
        "knowledgeTopics": knowledge_topics_for(symptoms, level),
        "locationContext": location_context,
        "recommendedHospitals": localize_hospitals(hospitals, language, resolved_location),
        "analysisSource": analysis_source,
        "display": display,
    }


def hospital_search(
    state: str | None,
    district: str | None,
    specialty: str | None,
    language: str = "en",
) -> dict:
    resolved_location = resolve_location(language, state, district)
    copy = copy_for(language)
    return {
        "state": resolved_location["state"],
        "district": resolved_location["district"],
        "specialty": specialty,
        "locationContext": location_context_for(resolved_location, copy),
        "results": localize_hospitals(
            find_hospitals(
                resolved_location["state"],
                resolved_location["district"],
                specialty,
            ),
            language,
            resolved_location,
        ),
    }
