# import google.generativeai as genai
# from config.settings import GOOGLE_API_KEY

# genai.configure(api_key=GOOGLE_API_KEY)
# model = genai.GenerativeModel("gemini-2.0-flash")

# def generate_answer(question, context, sources, use_case, history=None):
#     if use_case == "study":
#         system_prompt = """You are a strict AI study assistant. Your ONLY purpose is to answer questions using EXCLUSIVELY the provided document context.

# CRITICAL CONSTRAINTS - DO NOT VIOLATE:
# 1. You MUST ONLY use information explicitly stated in the DOCUMENT CONTEXT below.
# 2. You are COMPLETELY FORBIDDEN from using:
#    - Outside knowledge or general information
#    - Assumptions or inferences
#    - Information not directly in the provided context
# 3. If ANY part of the answer is not found in the context, you MUST respond EXACTLY:
#    "The document does not contain this information."
# 4. Do NOT provide partial answers or guess at missing information.
# 5. Do NOT say "Based on general knowledge..." or similar phrases.
# 6. Include page numbers if available in the context.
# 7. You may use the conversation history to understand follow-up questions,
#    but still answer ONLY from the document context.

# RESPONSE FORMAT:
# - Be direct and concise
# - Quote or closely paraphrase the context when possible
# - Always state if information is not available"""
#     else:
#         system_prompt = """You are a strict invoice data extraction tool. Extract ONLY verifiable data from the provided invoice context.

# CRITICAL CONSTRAINTS - DO NOT VIOLATE:
# 1. Extract ONLY fields and values that appear explicitly in the DOCUMENT CONTEXT.
# 2. Do NOT infer, calculate, or estimate any values.
# 3. Do NOT add information not present in the document.
# 4. For EVERY field requested:
#    - If present: provide the exact value from the document
#    - If missing: respond with "Not found" - NEVER attempt to guess or calculate
# 5. Do NOT use external knowledge about invoice formats or typical values.
# 6. Do NOT assume standard terms or default values.
# 7. You may use the conversation history to understand follow-up requests,
#    but extract ONLY from the document context.

# RESPONSE FORMAT:
# - For each field, state: "Field: Value" or "Field: Not found"
# - Be precise with numbers and exact text from the document
# - Include page reference if available"""

#     # Build conversation history block
#     history_block = ""
#     if history:
#         lines = []
#         for turn in history:
#             role = "User" if turn["role"] == "user" else "Assistant"
#             lines.append(f"{role}: {turn['content']}")
#         history_block = "\n".join(lines)

#     # Inject history into prompt only when it exists
#     history_section = f"""
# --------------------
# CONVERSATION HISTORY (for context on follow-up questions):
# {history_block}
# --------------------
# """ if history_block else ""

#     prompt = f"""
# {system_prompt}
# {history_section}
# --------------------
# DOCUMENT CONTEXT:
# {context}
# --------------------

# QUESTION/REQUEST:
# {question}

# ANSWER:
# """

#     response = model.generate_content(prompt)
#     return response.text.strip()



import os
from openai import OpenAI
from config.settings import GROQ_API_KEY

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

def generate_answer(question, context, sources, use_case, history=None):
    if use_case == "study":
        system_prompt = """You are a strict AI study assistant. Your ONLY purpose is to answer questions using EXCLUSIVELY the provided document context.

CRITICAL CONSTRAINTS - DO NOT VIOLATE:
1. You MUST ONLY use information explicitly stated in the DOCUMENT CONTEXT below.
2. You are COMPLETELY FORBIDDEN from using:
   - Outside knowledge or general information
   - Assumptions or inferences
   - Information not directly in the provided context
3. If ANY part of the answer is not found in the context, you MUST respond EXACTLY:
   "The document does not contain this information."
4. Do NOT provide partial answers or guess at missing information.
5. Do NOT say "Based on general knowledge..." or similar phrases.
6. Include page numbers if available in the context.
7. You may use the conversation history to understand follow-up questions,
   but still answer ONLY from the document context.

RESPONSE FORMAT:
- Be direct and concise
- Quote or closely paraphrase the context when possible
- Always state if information is not available"""
    else:
        system_prompt = """You are a strict invoice data extraction tool. Extract ONLY verifiable data from the provided invoice context.

CRITICAL CONSTRAINTS - DO NOT VIOLATE:
1. Extract ONLY fields and values that appear explicitly in the DOCUMENT CONTEXT.
2. Do NOT infer, calculate, or estimate any values.
3. Do NOT add information not present in the document.
4. For EVERY field requested:
   - If present: provide the exact value from the document
   - If missing: respond with "Not found" - NEVER attempt to guess or calculate
5. Do NOT use external knowledge about invoice formats or typical values.
6. Do NOT assume standard terms or default values.
7. You may use the conversation history to understand follow-up requests,
   but extract ONLY from the document context.

RESPONSE FORMAT:
- For each field, state: "Field: Value" or "Field: Not found"
- Be precise with numbers and exact text from the document
- Include page reference if available"""

    # Build messages array
    messages = [{"role": "system", "content": system_prompt}]

    # Inject prior conversation turns
    if history:
        for turn in history:
            messages.append({
                "role": turn["role"],        # "user" or "assistant"
                "content": turn["content"]
            })

    # Current turn with document context
    messages.append({
        "role": "user",
        "content": f"""--------------------
DOCUMENT CONTEXT:
{context}
--------------------

QUESTION/REQUEST:
{question}

ANSWER:"""
    })

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=1000,
    )

    return response.choices[0].message.content.strip()