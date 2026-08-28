import json
import os
import re
from typing import Dict, Any, Tuple, List

CHARTER_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "citizen_charter.json")

# Urgency and Hazard Triggers with weights
URGENCY_TRIGGERS = {
    "CRITICAL": {
        "weight": 95,
        "keywords": [
            "emergency", "danger", "fire", "spark", "broken wire", "live wire", "death", "blast",
            "poison", "toxic", "contamination", "sick", "hospital", "flood", "collapse", "child sick",
            "আগুন", "বিপদ", "তার ছিঁড়ে", "শক", "বিষাক্ত", "অসুস্থ", "জরুরি", "মৃত", "ভেঙে পড়েছে", "প্রাণহানি",
            "आग", "करंट", "तार टूट", "खतरा", "आपातकालीन", "जहरीला", "मौत", "बीमार", "विस्फोट", "दुर्घटना"
        ]
    },
    "HIGH": {
        "weight": 75,
        "keywords": [
            "overflow", "burst pipe", "blackout", "no water for days", "cave-in", "dengue", "severe", "sewage leak",
            "পাইপ ফেটে", "জল নেই", "অন্ধকার", "ডেঙ্গু", "নর্দমা উপচে", "কয়েক দিন ধরে", "রাস্তা বন্ধ",
            "पाइपलाइन टूटी", "पानी नहीं", "सीवर का पानी", "अंधेरा", "डेंगू", "गंभीर", "सड़क धंस"
        ]
    },
    "MEDIUM": {
        "weight": 50,
        "keywords": [
            "pothole", "garbage", "trash", "meter issue", "delay", "streetlight", "dirty", "stench",
            "গর্ত", "ময়লা", "আবর্জনা", "দেরি", "রাস্তার আলো", "মিটার", "গন্ধ",
            "गड्ढा", "कचरा", "स्ट्रीट लाइट", "बदबू", "कूड़ा", "मीटर खराबी"
        ]
    },
    "LOW": {
        "weight": 25,
        "keywords": [
            "inquiry", "status", "document", "general", "feedback", "card renewal", "scheme information",
            "তথ্য", "রেশন কার্ড রিনিউ", "জিজ্ঞাসা", "পদ্ধতি",
            "जानकारी", "नवीनीकरण", "योजना", "पूछताछ"
        ]
    }
}

class DepartmentClassifier:
    def __init__(self):
        with open(CHARTER_PATH, "r", encoding="utf-8") as f:
            self.charter_data = json.load(f)
        self.departments = self.charter_data.get("departments", [])

    def classify_and_score(self, raw_text: str, normalized_text: str, detected_lang: str) -> Dict[str, Any]:
        combined_text = (raw_text + " " + normalized_text).lower()
        
        # 1. Department Matching via weighted keyword hits
        dept_scores = {}
        matched_keywords_per_dept = {}

        for dept in self.departments:
            score = 0
            hits = []
            for kw in dept.get("keywords", []):
                pattern = r'\b' + re.escape(kw.lower()) + r'\b' if len(kw) > 3 else re.escape(kw.lower())
                matches = len(re.findall(pattern, combined_text))
                if matches > 0:
                    score += matches * 10
                    hits.append(kw)
            dept_scores[dept["id"]] = score
            matched_keywords_per_dept[dept["id"]] = hits

        # Determine best department
        best_dept_id = max(dept_scores.items(), key=lambda x: x[1])[0]
        if dept_scores[best_dept_id] == 0:
            # Fallback to municipal waste or general public works
            best_dept_id = "MUNICIPAL_WASTE"
            best_dept_info = next(d for d in self.departments if d["id"] == best_dept_id)
        else:
            best_dept_info = next(d for d in self.departments if d["id"] == best_dept_id)

        # 2. Urgency and Priority Calculation
        urgency_score = 30  # Baseline
        urgency_level = "LOW"
        detected_triggers = []

        for level, data in URGENCY_TRIGGERS.items():
            for kw in data["keywords"]:
                if kw in combined_text:
                    detected_triggers.append(kw)
                    if data["weight"] > urgency_score:
                        urgency_score = data["weight"]
                        urgency_level = level

        # Adjust score by length, sentiment modifiers, and repetition
        if len(raw_text) > 200:
            urgency_score = min(100, urgency_score + 5)
        
        # SLA Calculation
        if urgency_level == "CRITICAL":
            sla_hours = best_dept_info.get("sla_critical", 4)
        elif urgency_level == "HIGH":
            sla_hours = 24
        elif urgency_level == "MEDIUM":
            sla_hours = best_dept_info.get("sla_routine", 48)
        else:
            sla_hours = 72

        # Subcategory synthesis
        sub_cat = f"{best_dept_info['name_en']} - General Grievance"
        if matched_keywords_per_dept[best_dept_id]:
            top_hit = matched_keywords_per_dept[best_dept_id][0]
            sub_cat = f"{best_dept_info['name_en']} ({top_hit.title()} Resolution)"

        return {
            "department_id": best_dept_id,
            "department_name": best_dept_info["name_en"],
            "sub_category": sub_cat,
            "priority_level": urgency_level,
            "priority_score": int(urgency_score),
            "sla_hours": sla_hours,
            "detected_triggers": detected_triggers[:5]
        }
