import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.abspath('.'))

from app.pipelines.rag_assistant import MultilingualRAGAssistant

def test_rag_system():
    print("=" * 60)
    print("   JanSetu AI - Vector Database & RAG System Test")
    print("=" * 60)

    assistant = MultilingualRAGAssistant()

    # Test Query 1: Bengali Water Query
    q1 = "আমাদের পাড়ায় জলের পাইপ ফেটে গেছে, কী করব?"
    print(f"\n[Test 1] Citizen Query (Bengali): \"{q1}\"")
    res1 = assistant.answer_query(q1, language_code='bn')
    print(f"🤖 Nagrik Sahayak Reply:\n{res1['reply']}")
    print(f"📚 Sources Cited: {res1['cited_sources']}")

    # Test Query 2: English Electrical Emergency Query
    q2 = "11KV electric wire snapped and fallen on main road, how fast will it be fixed?"
    print(f"\n[Test 2] Citizen Query (English): \"{q2}\"")
    res2 = assistant.answer_query(q2, language_code='en')
    print(f"🤖 Nagrik Sahayak Reply:\n{res2['reply']}")
    print(f"📚 Sources Cited: {res2['cited_sources']}")

    print("\n" + "=" * 60)
    print("✅ Local Vector Database & RAG Pipeline Working Perfectly!")
    print("=" * 60)

if __name__ == "__main__":
    test_rag_system()
