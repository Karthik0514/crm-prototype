import json
import ollama

from prompts import CALL_SCRIPT_PROMPT
from schemas import CallScriptResponse


def generate_call_script(lead):

    prompt = CALL_SCRIPT_PROMPT.format(
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
        format=CallScriptResponse.model_json_schema()
    )

    return json.loads(response["message"]["content"])