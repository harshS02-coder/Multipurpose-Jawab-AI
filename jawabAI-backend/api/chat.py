from processing.embedder import embed
from retrieval.pinecone_client import query
from llm.generator import generate_answer
from storage.redis_client import redis_client
from utils.cache_helper import cache_helper

import uuid

def chat(payload):
    document_id = payload["document_id"]
    use_case = payload.get("use_case", "study")
    question = payload["question"]

    
    session_id  = payload.get("session_id") or str(uuid.uuid4())

    # Step 1: Check document status
    status = redis_client.get(f"ingest:{document_id}")
    if status != "DONE":
        return {"error": "Document not ready"}
    
    # Step 2: Check if this query was already answered (cache)
    # cached_response = cache_helper.get_cached_query_response(document_id, question)

    cached_response = cache_helper.get_cached_query_response(
        f"{session_id}:{document_id}", question
    )

    if cached_response:
        print(f"✨ Returning cached answer for: {question[:50]}...")
        cached_response["cached"] = True

        cached_response["session_id"] = session_id

        return cached_response

    namespace = f"{use_case}:{document_id}"
    query_vec = embed([question])[0]

    results = query(query_vec, namespace, document_id=document_id)
    
    contexts = []
    sources = []

    # Handle Pinecone QueryResponse - results.matches is a list of Match objects
    matches = results.matches if hasattr(results, 'matches') else results.get("matches", [])
    
    for match in matches:
        # Handle both object attributes and dict access
        if hasattr(match, 'metadata'):
            metadata = match.metadata or {}
        else:
            metadata = match.get("metadata", {}) or {}

        text = metadata.get("text", "") if isinstance(metadata, dict) else getattr(metadata, "text", "")
        page = metadata.get("page", "N/A") if isinstance(metadata, dict) else getattr(metadata, "page", "N/A")
        source = metadata.get("source", "document") if isinstance(metadata, dict) else getattr(metadata, "source", "document")
        score = match.score if hasattr(match, 'score') else match.get("score", 0)

        contexts.append(f"[Page {page}] {text}")

        sources.append({
            "page": page,
            "source": source,
            "score": score
        })

    context = "\n\n".join(contexts)

    # Step 3: Generate answer (cache miss - need to process)

    # Step 3: Load conversation history for this session
    history = cache_helper.get_history(session_id)
    print(f"🔍 Processing new query: {question[:50]}...")
    answer = generate_answer(
        question=question,
        context=context,
        sources=sources,
        use_case=use_case,

        history=history,
    )

    # Step 4: Prepare response

    cache_helper.append_to_history(session_id, "user", question)
    cache_helper.append_to_history(session_id, "assistant", answer)
    response = {
        "answer": answer,
        "sources": sources,
        "cached": False,

        "session_id": session_id,
    }
    
    # Step 5: Cache the response for future queries
    # cache_helper.cache_query_response(document_id, question, response)

    
    cache_helper.cache_query_response(

        f"{session_id}:{document_id}", question, response

    )

    return response
