from fastapi import FastAPI
import ollama

from ai import analyze_lead
from email_agent import generate_email
from whatsapp_agent import generate_whatsapp
from call_agent import generate_call_script
from agent import agent_decide

from tool_executor import (
    search_lead,
    get_all_leads,
    update_lead,
    delete_lead,
    convert_lead,
)
from schemas import (
    LeadRequest,
    ChatRequest,
    ChatResponse
)

app = FastAPI()


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.get("/")
def home():
    return {"message": "AI Service Running"}


# --------------------------------------------------
# AI AGENTS
# --------------------------------------------------

@app.post("/analyze")
def analyze(lead: LeadRequest):
    return analyze_lead(lead)


@app.post("/generate-email")
def generate_email_endpoint(lead: LeadRequest):
    return generate_email(lead)


@app.post("/generate-whatsapp")
def whatsapp_endpoint(lead: LeadRequest):
    return generate_whatsapp(lead)


@app.post("/generate-call-script")
def call_script_endpoint(lead: LeadRequest):
    return generate_call_script(lead)


# --------------------------------------------------
# AI CHAT
# --------------------------------------------------


def build_lead_request(lead):

    return LeadRequest(
        name=lead["name"],
        company=lead["company"],
        phone=lead["phone"],
        email=lead["email"],
        source=lead["source"],
        status=lead["status"],
        notes=lead["notes"],
    )


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    system_prompt = {
        "role": "system",
        "content": """
You are Konaseema CRM AI Assistant.

You assist sales teams with:

- Lead Analysis
- Sales Strategy
- CRM Guidance
- Professional Emails
- WhatsApp Messages
- Call Scripts

IMPORTANT RULES:

1. If CRM data is provided, ALWAYS use it.
2. CRM data is the source of truth.
3. Never say "I cannot find information" if CRM data exists.
4. Summarize CRM notes whenever useful.
5. Mention company, status and source naturally.
6. If the user asks about a lead, answer directly from CRM.
7. Be concise and professional.
"""
    }

    messages = [system_prompt]

    # ---------------------------------------
    # Find Lead Mentioned
    # ---------------------------------------

    last_message = request.messages[-1].content.lower()

    print("\n==============================")
    print("User Message:", last_message)
    decision = agent_decide(last_message)

    all_leads = []

    if decision["action"] == "list_leads":

        all_leads = get_all_leads()

        messages.append({
            "role": "system",
            "content": 
            f"""
    Current CRM Database

    {all_leads}

    Answer the user's question ONLY using this CRM data.
    """,
        })

    print("Agent Decision:", decision)

    lead_results = []

    lead_name = decision.get("lead_name")

    if lead_name:

        lead_results = search_lead(lead_name)

    print("Lead Results:", lead_results)

    # -----------------------------
    # UPDATE
    # -----------------------------

    if decision["action"] == "update_lead":

        if lead_results:

            lead = lead_results[0]

            lead[decision["field"]] = decision["value"]

            update_lead(

                lead["id"],

                lead

            )

            return ChatResponse(

                response=f"{lead['name']} updated successfully."

            )

    # -----------------------------
    # DELETE
    # -----------------------------

    if decision["action"] == "delete_lead":

        if lead_results:

            delete_lead(

                    lead_results[0]["id"]

                )

            return ChatResponse(

                    response=f"{lead_results[0]['name']} deleted successfully."

                )

    # -----------------------------
    # CONVERT
    # -----------------------------

    if decision["action"] == "convert_lead":

        if lead_results:

            convert_lead(

                lead_results[0]["id"]

            )

            return ChatResponse(

                response=f"{lead_results[0]['name']} converted successfully."

            )

    # -----------------------------
    # EMAIL
    # -----------------------------

    if decision["action"] == "generate_email":

        if lead_results:

            lead = lead_results[0]
            lead_request = build_lead_request(lead)

            email = generate_email(lead_request)

            return ChatResponse(response=f"""
    Subject: {email.subject}

    {email.greeting}

    {email.body}

    {email.closing}
    """)
    # -----------------------------
    # WHATSAPP
    # -----------------------------

    if decision["action"] == "generate_whatsapp":

        if lead_results:

            lead = lead_results[0]
            lead_request = build_lead_request(lead)

            whatsapp = generate_whatsapp(lead_request)

            return ChatResponse(
                response=whatsapp.message
            )
    # -----------------------------
    # CALL SCRIPT
    # -----------------------------

    if decision["action"] == "generate_call_script":

        if lead_results:

            lead = lead_results[0]
            lead_request = build_lead_request(lead)

            script = generate_call_script(lead_request)

            return ChatResponse(response=script.script)
    # ---------------------------------------
    # Inject CRM Context BEFORE Conversation
    # ---------------------------------------

    if lead_results:

        lead = lead_results[0]

        crm_context = {
            "role": "system",
            "content": f"""
CURRENT CRM RECORD

Name: {lead['name']}
Company: {lead['company']}
Phone: {lead['phone']}
Email: {lead['email']}
Source: {lead['source']}
Status: {lead['status']}
Notes: {lead['notes']}

This CRM information is accurate.
Use it to answer the user's question.
Do not ask for information already provided.
"""
        }

        messages.append(crm_context)

    # ---------------------------------------
    # Conversation History
    # ---------------------------------------

    for msg in request.messages:

        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    # ---------------------------------------
    # DEBUG
    # ---------------------------------------

    print("\n========== PROMPT TO OLLAMA ==========")

    for m in messages:

        print("----------------------------------")
        print(m["role"])
        print(m["content"])

    print("======================================\n")

    # ---------------------------------------
    # OLLAMA
    # ---------------------------------------

    response = ollama.chat(

        model="llama3.2",

        messages=messages

    )

    print("\nAI Response:")
    print(response["message"]["content"])

    return ChatResponse(
        response=response["message"]["content"]
    )
