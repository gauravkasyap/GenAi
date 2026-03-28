"""Static domain data for the rural healthcare assistant."""

from __future__ import annotations

from collections import defaultdict


LANGUAGES = [
    {"code": "en", "label": "English", "speech": "en-IN"},
    {"code": "hi", "label": "हिन्दी", "speech": "hi-IN"},
    {"code": "bn", "label": "বাংলা", "speech": "bn-IN"},
    {"code": "mr", "label": "मराठी", "speech": "mr-IN"},
    {"code": "ta", "label": "தமிழ்", "speech": "ta-IN"},
    {"code": "te", "label": "తెలుగు", "speech": "te-IN"},
]


PERSONAS = [
    {"id": "adult", "labels": {"en": "Adult", "hi": "वयस्क", "bn": "প্রাপ্তবয়স্ক", "mr": "प्रौढ", "ta": "வயது வந்தவர்"}},
    {"id": "child", "labels": {"en": "Child", "hi": "बच्चा", "bn": "শিশু", "mr": "मुल", "ta": "குழந்தை"}},
    {"id": "elderly", "labels": {"en": "Elderly", "hi": "बुजुर्ग", "bn": "বয়স্ক", "mr": "ज्येष्ठ", "ta": "மூத்தவர்"}},
    {"id": "pregnancy", "labels": {"en": "Pregnancy", "hi": "गर्भावस्था", "bn": "গর্ভাবস্থা", "mr": "गर्भावस्था", "ta": "கர்ப்பம்"}},
]


SYMPTOMS = [
    {
        "id": "fever",
        "labels": {"en": "Fever", "hi": "बुखार", "bn": "জ্বর", "mr": "ताप", "ta": "காய்ச்சல்"},
        "keywords": ["fever", "temperature", "bukhar", "ज्वर", "बुखार", "জ্বর", "ताप", "காய்ச்சல்"],
        "specialty": "general_medicine",
    },
    {
        "id": "cough",
        "labels": {"en": "Cough", "hi": "खांसी", "bn": "কাশি", "mr": "खोकला", "ta": "இருமல்"},
        "keywords": ["cough", "khansi", "खांसी", "কাশি", "खोकला", "இருமல்"],
        "specialty": "general_medicine",
    },
    {
        "id": "breathlessness",
        "labels": {"en": "Trouble breathing", "hi": "सांस लेने में तकलीफ", "bn": "শ্বাসকষ্ট", "mr": "श्वास घेण्यास त्रास", "ta": "மூச்சுத்திணறல்"},
        "keywords": ["breathless", "shortness of breath", "saans", "श्वास", "सांस", "শ্বাসকষ্ট", "दम", "மூச்சு"],
        "specialty": "emergency",
    },
    {
        "id": "chest_pain",
        "labels": {"en": "Chest pain", "hi": "सीने में दर्द", "bn": "বুকের ব্যথা", "mr": "छातीत दुखणे", "ta": "மார்பு வலி"},
        "keywords": ["chest pain", "सीने", "छाती", "বুক", "छातीत", "மார்பு"],
        "specialty": "emergency",
    },
    {
        "id": "diarrhea",
        "labels": {"en": "Loose motions", "hi": "दस्त", "bn": "পায়খানা পাতলা", "mr": "जुलाब", "ta": "வயிற்றுப்போக்கு"},
        "keywords": ["diarrhea", "diarrhoea", "loose motion", "दस्त", "পাতলা", "जुलाब", "வயிற்றுப்போக்கு"],
        "specialty": "general_medicine",
    },
    {
        "id": "vomiting",
        "labels": {"en": "Vomiting", "hi": "उल्टी", "bn": "বমি", "mr": "उलटी", "ta": "வாந்தி"},
        "keywords": ["vomit", "vomiting", "उल्टी", "বমি", "उलटी", "வாந்தி"],
        "specialty": "general_medicine",
    },
    {
        "id": "dehydration",
        "labels": {"en": "Weakness / dehydration", "hi": "कमजोरी / पानी की कमी", "bn": "দুর্বলতা / পানিশূন্যতা", "mr": "अशक्तपणा / पाण्याची कमतरता", "ta": "பலவீனம் / நீரிழப்பு"},
        "keywords": ["dehydration", "weak", "weakness", "सूखा", "पानी की कमी", "দুর্বল", "पाण्याची", "நீரிழப்பு"],
        "specialty": "general_medicine",
    },
    {
        "id": "headache",
        "labels": {"en": "Headache", "hi": "सिर दर्द", "bn": "মাথাব্যথা", "mr": "डोकेदुखी", "ta": "தலைவலி"},
        "keywords": ["headache", "सिर दर्द", "माथा", "মাথা", "डोके", "தலைவলি"],
        "specialty": "general_medicine",
    },
    {
        "id": "dizziness",
        "labels": {"en": "Dizziness", "hi": "चक्कर", "bn": "মাথা ঘোরা", "mr": "गरगरणे", "ta": "தலைச்சுற்றல்"},
        "keywords": ["dizzy", "dizziness", "चक्कर", "মাথা ঘোরা", "गरगर", "தலைச்சுற்றல்"],
        "specialty": "general_medicine",
    },
    {
        "id": "severe_bleeding",
        "labels": {"en": "Heavy bleeding", "hi": "बहुत रक्तस्राव", "bn": "অতিরিক্ত রক্তপাত", "mr": "जास्त रक्तस्राव", "ta": "அதிக ரத்தப்போக்கு"},
        "keywords": ["bleeding", "blood loss", "रक्तस्राव", "রক্তপাত", "रक्तस्त्राव", "ரத்தப்போக்கு"],
        "specialty": "emergency",
    },
    {
        "id": "pregnancy_pain",
        "labels": {"en": "Pregnancy pain / bleeding", "hi": "गर्भावस्था में दर्द / रक्तस्राव", "bn": "গর্ভাবস্থায় ব্যথা / রক্তপাত", "mr": "गर्भावस्थेत वेदना / रक्तस्राव", "ta": "கர்ப்பத்தில் வலி / ரத்தப்போக்கு"},
        "keywords": ["pregnancy pain", "pregnant", "गर्भ", "प्रेग्नेंट", "গর্ভ", "கர்ப்ப"],
        "specialty": "maternal_health",
    },
    {
        "id": "stroke_signs",
        "labels": {"en": "Face droop / weakness", "hi": "चेहरा टेढ़ा / कमजोरी", "bn": "মুখ বেঁকে যাওয়া / দুর্বলতা", "mr": "चेहरा वाकडा / अशक्तपणा", "ta": "முக விலகல் / பலவீனம்"},
        "keywords": ["stroke", "face droop", "weak arm", "speech trouble", "लकवा", "चेहरा", "বাঁকা", "வாய் சுளுக்கு"],
        "specialty": "emergency",
    },
    {
        "id": "high_sugar",
        "labels": {"en": "High sugar / diabetes issue", "hi": "शुगर की समस्या", "bn": "ডায়াবেটিস সমস্যা", "mr": "साखरेची समस्या", "ta": "சர்க்கரை பிரச்சனை"},
        "keywords": ["sugar", "diabetes", "शुगर", "डायबिटीज", "ডায়াবেটিস", "मधुमेह", "சர்க்கரை"],
        "specialty": "general_medicine",
    },
    {
        "id": "rash",
        "labels": {"en": "Rash / skin issue", "hi": "चकत्ते / त्वचा समस्या", "bn": "ফুসকুড়ি / ত্বকের সমস্যা", "mr": "पुरळ / त्वचेची समस्या", "ta": "சருமப் பிரச்சனை"},
        "keywords": ["rash", "itching", "चकत्ते", "खुजली", "ফুসকুড়ি", "पुरळ", "அரிப்பு"],
        "specialty": "general_medicine",
    },
    {
        "id": "injury",
        "labels": {"en": "Injury / fall", "hi": "चोट / गिरना", "bn": "চোট / পড়ে যাওয়া", "mr": "इजा / पडणे", "ta": "காயம் / விழுதல்"},
        "keywords": ["injury", "fall", "cut", "चोट", "गिर", "পড়ে", "इजा", "விழுதல்"],
        "specialty": "emergency",
    },
]


HOSPITALS = [
    {
        "id": "up-barabanki-dh",
        "name": "District Hospital Barabanki",
        "state": "Uttar Pradesh",
        "district": "Barabanki",
        "type": "district_hospital",
        "specialties": ["general_medicine", "emergency", "maternal_health", "pediatrics"],
        "phone": "05248-224801",
        "address": "Civil Lines, Barabanki, Uttar Pradesh",
        "hours": "24x7 emergency",
    },
    {
        "id": "up-bahraich-chc",
        "name": "CHC Nanpara",
        "state": "Uttar Pradesh",
        "district": "Bahraich",
        "type": "chc",
        "specialties": ["general_medicine", "maternal_health", "pediatrics"],
        "phone": "05253-220116",
        "address": "Nanpara, Bahraich, Uttar Pradesh",
        "hours": "OPD + referral support",
    },
    {
        "id": "bihar-gaya-dh",
        "name": "Anugrah Narayan Magadh Medical College & Hospital",
        "state": "Bihar",
        "district": "Gaya",
        "type": "district_hospital",
        "specialties": ["general_medicine", "emergency", "maternal_health", "pediatrics"],
        "phone": "0631-2300342",
        "address": "Sherghati Road, Gaya, Bihar",
        "hours": "24x7 emergency",
    },
    {
        "id": "bihar-samastipur-phc",
        "name": "PHC Pusa",
        "state": "Bihar",
        "district": "Samastipur",
        "type": "phc",
        "specialties": ["general_medicine", "maternal_health"],
        "phone": "06274-240011",
        "address": "Pusa, Samastipur, Bihar",
        "hours": "Primary care and referral",
    },
    {
        "id": "rajasthan-ajmer-dh",
        "name": "JLN Hospital Ajmer",
        "state": "Rajasthan",
        "district": "Ajmer",
        "type": "district_hospital",
        "specialties": ["general_medicine", "emergency", "maternal_health", "pediatrics"],
        "phone": "0145-2427043",
        "address": "Ajmer, Rajasthan",
        "hours": "24x7 emergency",
    },
    {
        "id": "rajasthan-banswara-chc",
        "name": "CHC Kushalgarh",
        "state": "Rajasthan",
        "district": "Banswara",
        "type": "chc",
        "specialties": ["general_medicine", "maternal_health", "pediatrics"],
        "phone": "02965-276022",
        "address": "Kushalgarh, Banswara, Rajasthan",
        "hours": "Day OPD + referral",
    },
    {
        "id": "odisha-koraput-dh",
        "name": "Sahid Laxman Nayak Medical College Hospital",
        "state": "Odisha",
        "district": "Koraput",
        "type": "district_hospital",
        "specialties": ["general_medicine", "emergency", "maternal_health", "pediatrics"],
        "phone": "06852-250700",
        "address": "Koraput, Odisha",
        "hours": "24x7 emergency",
    },
    {
        "id": "odisha-mayurbhanj-phc",
        "name": "PHC Karanjia",
        "state": "Odisha",
        "district": "Mayurbhanj",
        "type": "phc",
        "specialties": ["general_medicine", "maternal_health"],
        "phone": "06796-220245",
        "address": "Karanjia, Mayurbhanj, Odisha",
        "hours": "Primary care",
    },
    {
        "id": "maharashtra-nandurbar-dh",
        "name": "District Hospital Nandurbar",
        "state": "Maharashtra",
        "district": "Nandurbar",
        "type": "district_hospital",
        "specialties": ["general_medicine", "emergency", "maternal_health", "pediatrics"],
        "phone": "02564-221245",
        "address": "Nandurbar, Maharashtra",
        "hours": "24x7 emergency",
    },
    {
        "id": "maharashtra-gadchiroli-chc",
        "name": "CHC Aheri",
        "state": "Maharashtra",
        "district": "Gadchiroli",
        "type": "chc",
        "specialties": ["general_medicine", "maternal_health", "pediatrics"],
        "phone": "07133-222034",
        "address": "Aheri, Gadchiroli, Maharashtra",
        "hours": "Day OPD + referral",
    },
    {
        "id": "tamilnadu-dharmapuri-gh",
        "name": "Government Medical College Hospital Dharmapuri",
        "state": "Tamil Nadu",
        "district": "Dharmapuri",
        "type": "district_hospital",
        "specialties": ["general_medicine", "emergency", "maternal_health", "pediatrics"],
        "phone": "04342-260090",
        "address": "Dharmapuri, Tamil Nadu",
        "hours": "24x7 emergency",
    },
    {
        "id": "tamilnadu-theni-phc",
        "name": "PHC Andipatti",
        "state": "Tamil Nadu",
        "district": "Theni",
        "type": "phc",
        "specialties": ["general_medicine", "maternal_health", "pediatrics"],
        "phone": "04546-232245",
        "address": "Andipatti, Theni, Tamil Nadu",
        "hours": "Primary care",
    },
    {
        "id": "westbengal-purulia-dh",
        "name": "Purulia Government Medical College & Hospital",
        "state": "West Bengal",
        "district": "Purulia",
        "type": "district_hospital",
        "specialties": ["general_medicine", "emergency", "maternal_health", "pediatrics"],
        "phone": "03252-223955",
        "address": "Purulia, West Bengal",
        "hours": "24x7 emergency",
    },
    {
        "id": "assam-dhemaji-chc",
        "name": "CHC Silapathar",
        "state": "Assam",
        "district": "Dhemaji",
        "type": "chc",
        "specialties": ["general_medicine", "maternal_health", "pediatrics"],
        "phone": "03753-222145",
        "address": "Silapathar, Dhemaji, Assam",
        "hours": "Day OPD + referral",
    },
    {
        "id": "jharkhand-simdega-dh",
        "name": "Sadar Hospital Simdega",
        "state": "Jharkhand",
        "district": "Simdega",
        "type": "district_hospital",
        "specialties": ["general_medicine", "emergency", "maternal_health", "pediatrics"],
        "phone": "06525-225084",
        "address": "Simdega, Jharkhand",
        "hours": "24x7 emergency",
    },
]


KNOWLEDGE_TOPICS = [
    {
        "id": "diarrhoea_ors",
        "title": "Diarrhoea and dehydration guidance",
        "summary": "Severe dehydration is dangerous, especially for children and older adults. ORS and prompt clinical review matter.",
        "source_name": "WHO fact sheet",
        "source_url": "https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease",
        "tags": ["diarrhea", "vomiting", "dehydration", "child"],
    },
    {
        "id": "cardio_stroke",
        "title": "Heart attack and stroke warning signs",
        "summary": "Chest pain, breathing difficulty, one-sided weakness, or trouble speaking need urgent emergency evaluation.",
        "source_name": "WHO cardiovascular disease topic page",
        "source_url": "https://www.who.int/health-topics/cardiovascular-diseases",
        "tags": ["chest_pain", "stroke_signs", "breathlessness"],
    },
    {
        "id": "emergency_response",
        "title": "India emergency response",
        "summary": "India's ERSS integrates medical, police, and fire support through 112, alongside ambulance services like 108 where available.",
        "source_name": "112 India",
        "source_url": "https://112.gov.in/",
        "tags": ["emergency", "severe_bleeding", "injury", "stroke_signs", "breathlessness"],
    },
    {
        "id": "digital_health_services",
        "title": "Government digital health services",
        "summary": "NIC eHospital and ORS show how public hospitals can support digital appointments and patient-facing services.",
        "source_name": "NIC eHospital",
        "source_url": "https://www.nic.gov.in/project/ehospital/",
        "tags": ["general_medicine", "referral", "hospital"],
    },
    {
        "id": "bhashini_language",
        "title": "Indian-language voice and translation stack",
        "summary": "Bhashini's public mission is to support Indian-language access, speech, and translation across services.",
        "source_name": "Bhashini",
        "source_url": "https://bhashini.gov.in/bhashadaan/en/home",
        "tags": ["language", "voice", "translation"],
    },
    {
        "id": "public_health_platforms",
        "title": "National digital health ecosystem",
        "summary": "ABDM is the umbrella digital-health mission that can connect future referral, identity, and health-record workflows.",
        "source_name": "ABDM",
        "source_url": "https://abdm.gov.in/",
        "tags": ["hospital", "referral", "records"],
    },
]


SPECIALTY_LABELS = {
    "general_medicine": "General medicine",
    "maternal_health": "Maternal health",
    "pediatrics": "Pediatrics",
    "emergency": "Emergency",
}


FACILITY_LABELS = {
    "phc": "Primary Health Centre",
    "chc": "Community Health Centre",
    "district_hospital": "District hospital",
}


def states_and_districts() -> dict[str, list[str]]:
    grouped: dict[str, list[str]] = defaultdict(list)
    for hospital in HOSPITALS:
        grouped[hospital["state"]].append(hospital["district"])

    return {state: sorted(set(districts)) for state, districts in sorted(grouped.items())}
