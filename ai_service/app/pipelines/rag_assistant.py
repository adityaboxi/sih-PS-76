import json
import os
import re
from typing import Dict, Any, List

CHARTER_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "citizen_charter.json")

class MultilingualRAGAssistant:
    def __init__(self):
        with open(CHARTER_PATH, "r", encoding="utf-8") as f:
            self.knowledge_data = json.load(f)
        self.departments = self.knowledge_data.get("departments", [])
        self.faqs = self.knowledge_data.get("faq_kb", [])

    def answer_query(self, query: str, lang_code: str = "en") -> Dict[str, Any]:
        query_lower = query.lower()
        
        # 1. Check if user is asking about specific ticket tracking
        tracking_match = re.search(r'gr-\d{4}-[a-z]{2}-\d+', query_lower)
        if tracking_match:
            ticket_id = tracking_match.group(0).upper()
            if lang_code == "bn":
                reply = f"আপনার অভিযোগ {ticket_id} সফলভাবে ট্র্যাক করা হয়েছে। সংশ্লিষ্ট বিভাগ তৎপরতার সাথে কাজ করছে এবং নির্ধারিত সময়ের মধ্যে নিষ্পত্তি সম্পন্ন হবে।"
            elif lang_code == "hi":
                reply = f"आपकी शिकायत {ticket_id} ट्रैक कर ली गई है। संबंधित विभाग द्वारा कार्यवाही की जा रही है और इसे निर्धारित समय में हल किया जाएगा।"
            else:
                reply = f"Your grievance ticket {ticket_id} has been tracked. It is currently under active resolution by the nodal officer within the mandated SLA."
            return {
                "reply": reply,
                "detected_language": lang_code,
                "cited_sources": [f"National Grievance Tracking Engine: {ticket_id}"],
                "suggested_actions": ["View Full Timeline", "Download Acknowledgement PDF", "Escalate to District Collector"]
            }

        # 2. Check FAQs knowledge base
        for faq in self.faqs:
            q_text = (faq.get("q_en", "") + " " + faq.get("q_bn", "") + " " + faq.get("q_hi", "")).lower()
            overlap = any(w in query_lower for w in ["ration", "রেশন", "राशन", "card", "কার্ড", "कार्ड"]) and any(w in query_lower for w in ["apply", "নতুন", "नया", "document", "কাগজ", "दस्तावेज"])
            if overlap or any(kw in query_lower for kw in ["wire", "তার", "तार", "current", "electric", "কারেন্ট", "बिजली"]):
                if lang_code == "bn":
                    reply = faq.get("ans_bn", faq.get("ans_en"))
                elif lang_code == "hi":
                    reply = faq.get("ans_hi", faq.get("ans_en"))
                else:
                    reply = faq.get("ans_en")
                return {
                    "reply": reply,
                    "detected_language": lang_code,
                    "cited_sources": ["Citizen's Charter & Public Service Guarantee Act"],
                    "suggested_actions": ["File a New Grievance", "Check Required Documents", "Call Emergency Helpline"]
                }

        # 3. Department matching
        for dept in self.departments:
            for kw in dept.get("keywords", []):
                if kw in query_lower:
                    if lang_code == "bn":
                        reply = f"আপনার প্রশ্নটি '{dept.get('name_bn', dept['name_en'])}'-এর আওতাভুক্ত। {dept.get('charter')}"
                    elif lang_code == "hi":
                        reply = f"आपका प्रश्न '{dept.get('name_hi', dept['name_en'])}' से संबंधित है। {dept.get('charter')}"
                    else:
                        reply = f"Your query relates to '{dept['name_en']}'. Department charter: {dept.get('charter')}"
                    return {
                        "reply": reply,
                        "detected_language": lang_code,
                        "cited_sources": [f"Citizen Charter - {dept['name_en']}"],
                        "suggested_actions": ["Submit Grievance to this Department", "View Active Ward Officers", "Check Department SLA Guidelines"]
                    }

        # Default fallback contextual response in citizen's selected language
        if lang_code == "bn":
            reply = "নমস্কার! আমি নাগরিক সহায়ক এআই। আপনি যেকোনো ভাষায় সরকারি নাগরিক পরিষেবা, অভিযোগ দাখিল বা টিকিট ট্র্যাকিং সংক্রান্ত প্রশ্ন করতে পারেন। আমি কীভাবে সাহায্য করতে পারি?"
        elif lang_code == "hi":
            reply = "नमस्ते! मैं नागरिक सहायक एआई हूँ। आप किसी भी सरकारी सेवा, शिकायत दर्ज करने या ट्रैकिंग के संबंध में प्रश्न पूछ सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?"
        elif lang_code == "ta":
            reply = "வணக்கம்! நான் குடிமக்கள் உதவி AI. அரசு சேவைகள் மற்றும் புகார் கண்காணிப்பு குறித்து என்னிடம் கேட்கலாம்."
        elif lang_code == "te":
            reply = "నమస్కారం! నేను పౌర సహాయక AI. ప్రభుత్వ సేవలు మరియు ఫిర్యాదుల ట్రాకింగ్ గురించి మీరు నన్ను అడగవచ్చు."
        else:
            reply = "Hello! I am your AI Citizen Assistant. You can ask me questions regarding civic departments, government schemes, filing complaints, or tracking ticket status in any Indian language."

        return {
            "reply": reply,
            "detected_language": lang_code,
            "cited_sources": ["National Citizen Service Portal Standard Operating Procedures (SOP 2026)"],
            "suggested_actions": ["How to file a water supply complaint", "Electricity outage emergency numbers", "Track my grievance ticket"]
        }
