import math
import re
from typing import List, Dict, Any, Tuple

class DuplicateEngine:
    @staticmethod
    def _tokenize(text: str) -> List[str]:
        # Support both word tokens and character 3-grams for non-spaced/vernacular texts
        words = re.findall(r'\w+', text.lower())
        char_ngrams = [text[i:i+3] for i in range(len(text)-2)]
        return words + char_ngrams

    @classmethod
    def calculate_similarity(cls, text1: str, text2: str) -> float:
        """
        Calculates hybrid n-gram Jaccard + Cosine-like token similarity
        across multilingual texts.
        """
        tokens1 = set(cls._tokenize(text1))
        tokens2 = set(cls._tokenize(text2))
        
        if not tokens1 or not tokens2:
            return 0.0

        intersection = tokens1.intersection(tokens2)
        union = tokens1.union(tokens2)
        
        jaccard = len(intersection) / len(union)
        cosine_approx = len(intersection) / (math.sqrt(len(tokens1)) * math.sqrt(len(tokens2)))
        
        return round((0.4 * jaccard + 0.6 * cosine_approx), 4)

    @classmethod
    def find_duplicate(cls, new_text: str, department_id: str, existing_grievances: List[Dict[str, Any]], threshold: float = 0.65) -> Tuple[bool, str, float]:
        """
        Scans existing grievances in the same department to identify semantic duplicates.
        Returns: (is_duplicate, master_ticket_id, similarity_score)
        """
        if not existing_grievances:
            return False, None, 0.0

        best_score = 0.0
        best_master_id = None

        for item in existing_grievances:
            # Check same department or global
            item_dept = item.get("department_id")
            if department_id and item_dept and department_id != item_dept:
                continue

            existing_text = item.get("original_text", "") + " " + item.get("normalized_english_text", "")
            score = cls.calculate_similarity(new_text, existing_text)

            if score > best_score:
                best_score = score
                best_master_id = item.get("ticket_number") or item.get("id")

        if best_score >= threshold and best_master_id:
            return True, str(best_master_id), best_score

        return False, None, best_score
