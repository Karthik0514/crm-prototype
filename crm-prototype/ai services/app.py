from fastapi import FastAPI
from email_agent import generate_email
from schemas import LeadRequest
from ai import analyze_lead
from whatsapp_agent import generate_whatsapp
from call_agent import generate_call_script
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