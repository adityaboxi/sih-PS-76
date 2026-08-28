from typing import List, Dict, Any

class XAIEngine:
    """
    Generates transparent, audit-ready explanations for why a department and priority score were assigned,
    formatted in both English and the citizen's native Indian language.
    """
    @staticmethod
    def generate_reasoning(
        department_name: str,
        priority_level: str,
        priority_score: int,
        triggers: List[str],
        detected_lang: str,
        sla_hours: int
    ) -> Dict[str, Any]:
        trigger_str = ", ".join(triggers) if triggers else "standard civic indicators"

        # English explanation
        rationale_en = (
            f"Classified into '{department_name}' with {priority_level} priority (Score: {priority_score}/100) "
            f"due to triggers: [{trigger_str}]. Mandated SLA resolution window: {sla_hours} hours."
        )

        # Bengali explanation
        if detected_lang == "bn":
            rationale_local = (
                f"অভিযোগটিকে '{department_name}' বিভাগে অন্তর্ভুক্ত করা হয়েছে এবং জরুরি স্তর '{priority_level}' "
                f"(স্কোর: {priority_score}/১০০) ধার্য করা হয়েছে কারণ এতে [{trigger_str}] সংক্রান্ত জরুরি তথ্য রয়েছে। "
                f"নির্দিষ্ট সমাধানের সময়সীমা: {sla_hours} ঘণ্টা।"
            )
        # Hindi explanation
        elif detected_lang == "hi":
            rationale_local = (
                f"शिकायत को '{department_name}' में वर्गीकृत किया गया है और तात्कालिकता स्तर '{priority_level}' "
                f"(स्कोर: {priority_score}/100) तय किया गया है क्योंकि इसमें [{trigger_str}] के संकेत मिले हैं। "
                f"समाधान समय सीमा: {sla_hours} घंटे।"
            )
        # Tamil explanation
        elif detected_lang == "ta":
            rationale_local = (
                f"புகார் '{department_name}' துறைக்கு அனுப்பப்பட்டு முன்னுரிமை '{priority_level}' "
                f"வழங்கப்பட்டுள்ளது. தீர்வு காலக்கெடு: {sla_hours} மணிநேரம்."
            )
        # Telugu explanation
        elif detected_lang == "te":
            rationale_local = (
                f"ఫిర్యాదు '{department_name}' విభాగానికి కేటాయించబడింది మరియు ప్రాధాన్యత '{priority_level}' "
                f"గా నిర్ణయించబడింది. పరిష్కార గడువు: {sla_hours} గంటలు."
            )
        else:
            rationale_local = rationale_en

        return {
            "rule_applied": f"Govt_Civic_SLA_Triage_Policy_2026_{priority_level}",
            "key_triggers": triggers,
            "rationale_en": rationale_en,
            "rationale_local": rationale_local,
            "language_code": detected_lang,
            "confidence_score": float(priority_score)
        }
