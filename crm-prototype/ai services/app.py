from fastapi import FastAPI
from email_agent import generate_email
from schemas import LeadRequest
from ai import analyze_lead
from whatsapp_agent import generate_whatsapp
from call_agent import generate_call_script
import ollama

from schemas import (
    LeadRequest,
    ChatRequest,
    ChatResponse
)
app = FastAPI()


@app.get("/")
def home():
    return {"message": "AI Service Running"}


@app.post("/analyze")
def analyze(lead: LeadRequest):

   result = analyze_lead(lead)

   return result

@app.post("/generate-email")
def generate_email_endpoint(lead: LeadRequest):
    return generate_email(lead)

@app.post("/generate-whatsapp")
def whatsapp_endpoint(lead: LeadRequest):
    return generate_whatsapp(lead)

@app.post("/generate-call-script")
def call_script_endpoint(lead: LeadRequest):
    return generate_call_script(lead)

@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    response = ollama.chat(

        model="llama3.2",

        messages=[
            {
                "role": "system",
                "content": """
You are Konaseema CRM AI Assistant.

You help sales teams with:

- Lead analysis
- Sales strategies
- Professional emails
- WhatsApp messages
- Call scripts
- Customer communication
- CRM guidance

Always give concise, professional answers.
"""
            },
            {
                "role": "user",
                "content": request.message
            }
        ]

    )

    return ChatResponse(
        response=response["message"]["content"]
    )