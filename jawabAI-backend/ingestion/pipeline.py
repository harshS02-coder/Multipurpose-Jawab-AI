# from processing.loader import load_pdf
# from processing.chunker import chunk_text
# from processing.embedder import embed
# from retrieval.pinecone_client import upsert
# from storage.redis_client import redis_client

# def ingest_pipeline(file_url, use_case, document_id):
#     namespace = f"{use_case}:{document_id}"
#     redis_client.set(f"ingest:{document_id}", "PROCESSING")

#     text = load_pdf(file_url)
#     chunks_with_metadata = chunk_text(text, use_case)
    
#     # Extract just the text for embedding
#     chunk_texts = [chunk["text"] for chunk in chunks_with_metadata]
#     embeddings = embed(chunk_texts)

#     vectors = [
#         {
#             "id": f"{document_id}_{i}",
#             "values": emb,
#             "metadata": {
#                 "text": chunk_meta["text"],
#                 "page": chunk_meta["page"],
#                 "source": file_url,
#                 "document_id": document_id
#             }
#         }
#         for i, (chunk_meta, emb) in enumerate(zip(chunks_with_metadata, embeddings))
#     ]

#     upsert(vectors, namespace, document_id)
#     print(f"Ingestion pipeline completed for document ID '{document_id}' in namespace '{namespace}' with {len(vectors)} vectors.")
#     redis_client.set(f"ingest:{document_id}", "DONE")



#removing cloudinary upload to reduce latency

from processing.loader import load_pdf_from_bytes
from processing.chunker import chunk_text
from processing.embedder import embed
from retrieval.pinecone_client import upsert
from storage.redis_client import redis_client
from storage.cloudinary_client import upload_file
from io import BytesIO

def ingest_pipeline(file_content: bytes, use_case: str, document_id: str, filename: str = "document.pdf"):
    namespace = f"{use_case}:{document_id}"
    redis_client.set(f"ingest:{document_id}", "PROCESSING")

    try:
        # Step 1: Load PDF directly from bytes — no network call
        print(f"📄 Loading PDF from bytes for document: {document_id}")
        pages = load_pdf_from_bytes(file_content)

        # Step 2: Chunk
        chunks_with_metadata = chunk_text(pages, use_case)

        # Step 3: Embed
        chunk_texts = [chunk["text"] for chunk in chunks_with_metadata]
        embeddings = embed(chunk_texts)

        # Step 4: Upload to Cloudinary in background as permanent backup
        # This happens AFTER ingestion so it doesn't block the user
        print(f"☁️ Uploading to Cloudinary as backup...")
        cloudinary_url = upload_file(
            BytesIO(file_content),
            f"{use_case}/uploads"
        )
        print(f"✅ Cloudinary backup done: {cloudinary_url}")

        # Step 5: Upsert vectors with cloudinary URL as source
        vectors = [
            {
                "id": f"{document_id}_{i}",
                "values": emb,
                "metadata": {
                    "text": chunk_meta["text"],
                    "page": chunk_meta["page"],
                    "source": cloudinary_url,   # permanent URL for reference
                    "document_id": document_id
                }
            }
            for i, (chunk_meta, emb) in enumerate(zip(chunks_with_metadata, embeddings))
        ]

        upsert(vectors, namespace, document_id)
        print(f"✅ Ingestion complete: {document_id} — {len(vectors)} vectors")
        redis_client.set(f"ingest:{document_id}", "DONE")

    except Exception as e:
        print(f"❌ Ingestion failed for {document_id}: {e}")
        redis_client.set(f"ingest:{document_id}", "FAILED")
        raise