import json
import ollama

from prompts import WHATSAPP_PROMPT
from schemas import WhatsAppResponse


def generate_whatsapp(lead):

    prompt = WHATSAPP_PROMPT.format(
        name=lead.name,
        company=lead.company,
        phone=lead.phone,
        email=lead.email,
        source=lead.source,
        status=lead.status,
        notes=lead.notes
    )

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        format=WhatsAppResponse.model_json_schema()
    )

    return json.loads(response["message"]["content"])