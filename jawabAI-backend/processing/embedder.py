# from sentence_transformers import SentenceTransformer

# model = SentenceTransformer("all-MiniLM-L6-v2")

# def embed(chunks):
#     print(f"Generated embeddings for {len(chunks)} texts.")
#     return model.encode(
#         chunks,
#         normalize_embeddings=True,
#         show_progress_bar=True,
#         # batch_size=2
#         batch_size=32 
#     ).tolist()
    
# embedding with hf api

from pinecone import Pinecone
from config.settings import PINECONE_API_KEY

pc = Pinecone(api_key=PINECONE_API_KEY)

def embed(texts: list[str]) -> list[list[float]]:
    """Embed texts using Pinecone's hosted inference — no local model loaded."""
    if not texts:
        return []

    result = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=texts,
        parameters={"input_type": "passage", "truncate": "END"}
    )
    return [item["values"] for item in result.data]


def embed_query(text: str) -> list[float]:
    """Embed a single query string."""
    result = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[text],
        parameters={"input_type": "query", "truncate": "END"}
    )
    return result.data[0]["values"]