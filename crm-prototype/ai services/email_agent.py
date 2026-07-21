import json
import ollama
from schemas import EmailResponse
from prompts import EMAIL_PROMPT

def generate_email(lead):

    prompt = f"""
You are a professional sales executive for Konaseema Sustainable Solutions.

Write a professional email for this lead.

Name: {lead.name}
Company: {lead.company}
Source: {lead.source}
Status: {lead.status}
Notes: {lead.notes}

Return ONLY valid JSON.

{{
  "subject":"...",
  "email":"..."
}}
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        format=EmailResponse.model_json_schema()
    )
    
    prompt = EMAIL_PROMPT.format(
    name=lead.name,
    company=lead.company,
    phone=lead.phone,
    email=lead.email,
    source=lead.source,
    status=lead.status,
    notes=lead.notes
)

    return json.loads(response["message"]["content"])