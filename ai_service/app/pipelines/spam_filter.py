import re
from typing import Dict, Any

class SpamGuard:
    """
    Zero-Discard Safeguard:
    Never permanently delete a grievance. Assign a confidence score:
    - VERIFIED: >= 80 (Genuine, instant triage)
    - NEEDS_CLARIFICATION: 40 - 79 (Ambiguous/short text)
    - FLAGGED_REVIEW: < 40 (Suspected spam/gibberish, routed to Human Officer Triage Queue)
    """
    @staticmethod
    def evaluate(text: str) -> Dict[str, Any]:
        text_clean = text.strip()
        length = len(text_clean)
        
        if length == 0:
            return {"spam_score": 0.99, "status": "FLAGGED_REVIEW", "reason": "Empty payload"}

        # 1. Repetitive character sequences (e.g., 'aaaaaa', '1111111')
        repeats = len(re.findall(r'(.)\1{4,}', text_clean))
        
        # 2. Gibberish / character variety check
        unique_chars = len(set(text_clean))
        variety_ratio = unique_chars / max(1, length)

        # 3. Minimum word count
        words = text_clean.split()
        word_count = len(words)

        spam_score = 0.1  # Default healthy baseline

        if length < 8 or word_count < 2:
            spam_score += 0.45
        if repeats > 0:
            spam_score += 0.35
        if variety_ratio < 0.15 and length > 20:
            spam_score += 0.4

        spam_score = round(min(1.0, spam_score), 2)
        confidence_score = round((1.0 - spam_score) * 100, 1)

        if confidence_score >= 80:
            status = "VERIFIED"
        elif confidence_score >= 40:
            status = "NEEDS_CLARIFICATION"
        else:
            status = "FLAGGED_REVIEW"

        return {
            "spam_score": spam_score,
            "confidence_score": confidence_score,
            "verification_status": status,
            "safety_rule": "Zero-Discard Tri-Tier Protection (Triage Officer Queue for anomalies)"
        }
