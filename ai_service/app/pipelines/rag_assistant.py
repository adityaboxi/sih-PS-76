import os
import json
import logging
import math
import re
from app.core.config import settings

logger = logging.getLogger("jansetu-ai")

class LocalVectorDatabase:
    def __init__(self):
        self.documents = []
        self.vectors = []
        self.vocabulary = {}

    def _tokenize(self, text: str) -> list:
        return re.findall(r"\w+", text.lower())

    def _compute_tf_idf_vector(self, tokens: list) -> list:
        vec = [0.0] * len(self.vocabulary)
        for t in tokens:
            if t in self.vocabulary:
                idx = self.vocabulary[t]
                vec[idx] += 1.0
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec

    def index_documents(self, raw_docs: list):
        self.documents = raw_docs
        all_tokens_list = []
        vocab_set = set()

        for doc in raw_docs:
            combined_text = f"{doc.get('name', '')} {doc.get('department_name', '')} {doc.get('description', '')} {doc.get('question', '')} {doc.get('answer', '')} {doc.get('sla_rule', '')}"
            tokens = self._tokenize(combined_text)
            all_tokens_list.append(tokens)
            vocab_set.update(tokens)

        self.vocabulary = {word: i for i, word in enumerate(sorted(vocab_set))}
        self.vectors = [self._compute_tf_idf_vector(tokens) for tokens in all_tokens_list]
        logger.info(f"📚 Vector DB indexed {len(self.documents)} documents across {len(self.vocabulary)} dimensions.")

    def similarity_search(self, query: str, top_k: int = 2) -> list:
        if not self.vectors:
            return self.documents[:top_k]

        q_tokens = self._tokenize(query)
        q_vec = self._compute_tf_idf_vector(q_tokens)

        scores = []
        for idx, doc_vec in enumerate(self.vectors):
            dot_product = sum(a * b for a, b in zip(q_vec, doc_vec))
            scores.append((dot_product, self.documents[idx]))

        scores.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in scores[:top_k]]


class MultilingualRAGAssistant:
    def __init__(self):
        self.llm = None
        self.api_key = settings.GEMINI_API_KEY
        self.vector_db = LocalVectorDatabase()
        self._initialize_vector_store()

        if self.api_key:
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                self.llm = ChatGoogleGenerativeAI(
                    model=settings.MODEL_NAME,
                    google_api_key=self.api_key,
                    temperature=0.2,
                    max_output_tokens=512
                )
                logger.info(f"⚡ LangChain Gemini RAG active with model: {settings.MODEL_NAME}")
            except Exception as e:
                logger.warn(f"LangChain Gemini RAG init notice: {e}")

    def _initialize_vector_store(self):
        kb_path = os.path.join(os.path.dirname(__file__), "..", "data", "citizen_charter.json")
        if os.path.exists(kb_path):
            try:
                with open(kb_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    raw_docs = []
                    if isinstance(data, dict):
                        if "departments" in data:
                            raw_docs.extend(data["departments"])
                        if "faq_kb" in data:
                            raw_docs.extend(data["faq_kb"])
                    elif isinstance(data, list):
                        raw_docs = data
                    self.vector_db.index_documents(raw_docs)
            except Exception as e:
                logger.warn(f"Error loading citizen charter: {e}")

    def answer_query(self, query: str, language_code: str = "bn") -> dict:
        retrieved_docs = self.vector_db.similarity_search(query, top_k=2)
        context_str = json.dumps(retrieved_docs, ensure_ascii=False, indent=2)

        if self.llm:
            try:
                from langchain_core.prompts import PromptTemplate
                from langchain_core.output_parsers import StrOutputParser

                prompt_text = (
                    "You are Nagrik Sahayak, an official 24x7 AI Assistant for Indian Public Grievances (SIH PS 76).\n"
                    "Answer the citizen question using the retrieved context.\n\n"
                    "CONTEXT:\n{context}\n\n"
                    "QUESTION: {query}\n\n"
                    "TARGET LANGUAGE CODE: {language_code}"
                )

                prompt = PromptTemplate(
                    template=prompt_text,
                    input_variables=["language_code", "context", "query"]
                )

                chain = prompt | self.llm | StrOutputParser()
                response = chain.invoke({
                    "language_code": language_code,
                    "context": context_str,
                    "query": query
                })

                sources = [d.get("name", d.get("question", "Citizen Charter SOP 2026")) for d in retrieved_docs]

                return {
                    "reply": response.strip(),
                    "detected_language": language_code,
                    "cited_sources": sources,
                    "suggested_actions": ["File Grievance", "Track Status"]
                }
            except Exception as e:
                logger.warn(f"Gemini RAG generation notice: {e}")

        best_doc = retrieved_docs[0] if retrieved_docs else {}
        dept = best_doc.get("name", "Public Administration")
        sla = best_doc.get("default_sla_hours", 48)

        if language_code == "bn":
            if "জল" in query or "water" in query.lower() or "পাইপ" in query:
                reply = "জল সরবরাহ সংক্রান্ত সমস্যার জন্য আমাদের দপ্তর ৪ ঘণ্টার মধ্যে জরুরি মেরামত দল পাঠায় (হেল্পলাইন: ১৮০০-৩৪৫-৫৫৫৫)। আপনি এই পোর্টাল থেকেই সরাসরি অভিযোগ দাখিল করতে পারেন।"
            elif "বিদ্যুৎ" in query or "electric" in query.lower() or "তার" in query:
                reply = "ছেঁড়া বিদ্যুৎ তার বা স্পার্কিংয়ের ক্ষেত্রে অবিলম্বে বিদ্যুৎ হেল্পলাইন ১৯১২ অথবা ১১২ তে কল করুন। আমাদের পোর্টালে অভিযোগ দাখিল করলে ২ ঘণ্টার মধ্যে জরুরি কর্মী পৌঁছাবে।"
            else:
                reply = f"নমস্কার! আমি নাগরিক সহায়ক। {dept} এর নিয়ম অনুযায়ী অভিযোগের সর্বোচ্চ সমাধান সময়সীমা {sla} ঘণ্টা। আপনি সরাসরি এই পোর্টাল থেকে অভিযোগ দাখিল বা ট্র্যাক করতে পারেন।"
        else:
            if "water" in query.lower() or "pipe" in query.lower():
                reply = "For drinking water pipeline emergencies, our Water Supply department dispatches field repair crews within a 4-hour SLA window (Helpline: 1800-345-5555)."
            elif "electric" in query.lower() or "wire" in query.lower():
                reply = "For snapped live wires or electrical sparks, call emergency 1912 or 112 immediately. Tickets filed here receive an emergency 2-hour Critical SLA."
            else:
                reply = f"Namaste! I am Nagrik Sahayak. Under {dept} SOP, issues are resolved within {sla} hours. You can file or track your grievance directly here."

        return {
            "reply": reply,
            "detected_language": language_code,
            "cited_sources": [best_doc.get("name", "Citizen Charter SOP 2026")],
            "suggested_actions": ["File Grievance", "Track Status"]
        }
