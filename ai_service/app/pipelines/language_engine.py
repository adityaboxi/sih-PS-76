import re
from typing import Tuple, Dict

# Unicode code ranges for major Indian scripts
SCRIPT_MAP = {
    "bn": (0x0980, 0x09FF, "Bengali (বাংলা)"),
    "hi": (0x0900, 0x097F, "Hindi (हिन्दी)"),
    "ta": (0x0B80, 0x0BFF, "Tamil (தமிழ்)"),
    "te": (0x0C00, 0x0C7F, "Telugu (తెలుగు)"),
    "mr": (0x0900, 0x097F, "Marathi (मराठी)"),
    "gu": (0x0A80, 0x0AFF, "Gujarati (ગુજરાતી)"),
    "kn": (0x0C80, 0x0CFF, "Kannada (ಕನ್ನಡ)"),
    "ml": (0x0D00, 0x0D7F, "Malayalam (മലയാളം)"),
    "or": (0x0B00, 0x0B7F, "Odia (ଓଡ଼ିଆ)"),
    "pa": (0x0A00, 0x0A7F, "Punjabi (ਪੰਜਾਬੀ)"),
    "as": (0x0980, 0x09FF, "Assamese (অসমীয়া)"),
}

# Common transliteration and regional keyword dictionary for Indian grievances
INDIC_VOCAB_GLOSSARY = {
    # Bengali
    "জল": "water", "পানি": "water", "নল": "tap", "পাইপ": "pipeline", "নর্দমা": "drainage", "বিদ্যুৎ": "electricity", 
    "কারেন্ট": "electricity", "রাস্তা": "road", "গর্ত": "pothole", "হাসপাতাল": "hospital", "ওষুধ": "medicine",
    "ময়লা": "garbage", "আবর্জনা": "waste", "রেশন": "ration", "চুরি": "theft", "দুর্ঘটনা": "accident", "বিপদ": "danger",
    "জরুরি": "emergency", "অসুস্থ": "sick", "শিশুরা": "children", "আগুন": "fire", "তার ছিঁড়ে": "broken wire",
    # Hindi
    "पानी": "water", "गंदा": "dirty", "सीवर": "sewer", "बिजली": "electricity", "करंट": "current", "सड़क": "road",
    "गड्ढा": "pothole", "अस्पताल": "hospital", "दवा": "medicine", "कचरा": "garbage", "कूड़ा": "waste", "राशन": "ration",
    "चोरी": "theft", "दुर्घटना": "accident", "खतरा": "danger", "आपातकालीन": "emergency", "बीमार": "sick", "बच्चे": "children",
    "आग": "fire", "तार टूट": "broken wire", "ट्रांसफार्मर": "transformer",
    # Tamil
    "குடிநீர்": "drinking water", "மின்சாரம்": "electricity", "சாலை": "road", "மருத்துவமனை": "hospital", "குப்பை": "garbage",
    # Telugu
    "నీరు": "water", "విద్యుత్": "electricity", "రహదారి": "road", "ఆసుపత్రి": "hospital", "చెత్త": "garbage",
    # Marathi
    "पाणी": "water", "वीज": "electricity", "रस्ता": "road", "रुग्णालय": "hospital", "कचरा": "garbage",
    # Gujarati
    "પાણી": "water", "વીજળી": "electricity", "રસ્તો": "road", "હોસ્પિટલ": "hospital", "કચરો": "garbage"
}

class LanguageEngine:
    @staticmethod
    def detect_language(text: str) -> Tuple[str, str]:
        """
        Detects Indian regional language or English using unicode script density & vocabulary.
        Returns: (language_code, language_name)
        """
        if not text or not text.strip():
            return "en", "English"

        counts = {code: 0 for code in SCRIPT_MAP.keys() if code not in ["mr", "as"]}
        total_indic = 0

        for char in text:
            code_point = ord(char)
            for lang_code, (start, end, _) in SCRIPT_MAP.items():
                if lang_code in ["mr", "as"]:
                    continue
                if start <= code_point <= end:
                    counts[lang_code] += 1
                    total_indic += 1
                    break

        if total_indic > 0:
            top_lang = max(counts.items(), key=lambda x: x[1])[0]
            # Marathi discrimination in Devanagari script
            if top_lang == "hi":
                marathi_markers = ["आहे", "नाही", "झाला", "रस्ता", "पाणी", "करतो", "तक्रार", "कृपया"]
                if any(m in text for m in marathi_markers) or "ळ" in text:
                    return "mr", SCRIPT_MAP["mr"][2]
                return "hi", SCRIPT_MAP["hi"][2]

            # Assamese discrimination in Eastern Nagari script (Assamese unique characters: ৰ U+09F0, ৱ U+09F1)
            if top_lang == "bn":
                if "ৰ" in text or "ৱ" in text:
                    return "as", SCRIPT_MAP["as"][2]
                return "bn", SCRIPT_MAP["bn"][2]

            return top_lang, SCRIPT_MAP[top_lang][2]

        return "en", "English"

    @staticmethod
    def normalize_to_english_concepts(text: str, lang_code: str) -> str:
        """
        Preserves semantic intent while generating a normalized English concept string
        for unified cross-lingual vector embedding and classification.
        """
        words = re.findall(r'\w+', text.lower())
        mapped_terms = []
        for word in words:
            if word in INDIC_VOCAB_GLOSSARY:
                mapped_terms.append(INDIC_VOCAB_GLOSSARY[word])
            else:
                mapped_terms.append(word)
        return " ".join(mapped_terms)
