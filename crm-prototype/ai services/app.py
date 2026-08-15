from fastapi import FastAPI
import ollama

from ai import analyze_lead
from email_agent import generate_email
from whatsapp_agent import generate_whatsapp
from call_agent import generate_call_script

from agent import agent_decide, generate_chat_title

from tool_executor import (
    search_lead,
    get_all_leads,
    update_lead,
    delete_lead,
    convert_lead,
)

from schemas import LeadRequest, ChatRequest, ChatResponse

app = FastAPI()


# ==================================================
# HOME
# ==================================================


@app.get("/")
def home():

    return {"message": "AI Service Running"}


# ==================================================
# AI AGENTS
# ==================================================


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


# ==================================================
# BUILD LEAD REQUEST
# ==================================================


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


# ==================================================
# HELPER FUNCTIONS
# ==================================================
#
# The AI agents may return either:
#
# 1. A dictionary
#
# {
#     "subject": "...",
#     "greeting": "...",
#     "body": "...",
#     "closing": "..."
# }
#
# OR
#
# 2. A Pydantic/object response
#
# email.subject
#
# These helpers allow both formats.
# ==================================================


def get_email_field(email, field):

    if isinstance(email, dict):

        return email.get(field, "")

    return getattr(email, field, "")


def get_whatsapp_message(whatsapp):

    if isinstance(whatsapp, dict):

        return whatsapp.get("message", "")

    return getattr(whatsapp, "message", "")


def get_call_script(script):

    if isinstance(script, dict):

        return script.get("script", "")

    return getattr(script, "script", "")


# ==================================================
# AI CHAT
# ==================================================


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    # ==================================================
    # BASIC VALIDATION
    # ==================================================

    if not request.messages:

        return ChatResponse(
            response="Please enter a message.",
            lead_name=request.current_lead,
            pending_action=request.pending_action,
        )

    # ==================================================
    # SYSTEM PROMPT
    # ==================================================

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


1. CRM data is the source of truth.


2. Never invent CRM leads.


3. If a current lead is provided, use that lead automatically
   when the user refers to:

   - him
   - her
   - them
   - this lead
   - the lead
   - write an email
   - write a message
   - draft an email
   - draft a message
   - follow up
   - send a follow-up
   - message him
   - message her
   - write to them
   - create a call script


4. If the user explicitly mentions a different lead name,
   use that lead instead.


5. Never replace the current lead with a random lead name.


6. If the user says:

   - yes
   - yeah
   - yep
   - sure
   - okay
   - ok
   - do it
   - go ahead
   - please do

   and there is a pending action, continue that action.


7. Be conversational and professional.


8. Use CRM information whenever available.


9. Do not ask the user to repeat information that is already
   available in the current conversation.


10. If the user asks for an email, WhatsApp message, or call script,
    perform the requested action using the appropriate CRM lead.


11. If the user asks something like:

    "write an email"
    "draft a message"
    "follow up with him"
    "send her a WhatsApp"
    "write something to them"

    and a current lead exists, do NOT require the lead name again.


12. NEVER invent a lead name.

13. If the user did not explicitly mention a lead name,
    and a remembered/current lead exists,
    use the remembered/current lead.

14. The current lead has priority over any lead name
    hallucinated by the intent classifier.

""",
    }

    messages = [system_prompt]

    # ==================================================
    # LAST MESSAGE
    # ==================================================

    last_message = request.messages[-1].content.strip()

    last_message_lower = last_message.lower()

    print("\n======================================")

    print("User Message:", last_message)

    # ==================================================
    # CONVERSATION MEMORY
    # ==================================================

    remembered_lead = request.current_lead

    pending_action = request.pending_action

    print("Remembered Lead:", remembered_lead)

    print("Pending Action:", pending_action)

    # ==================================================
    # AGENT DECISION
    # ==================================================

    decision = agent_decide(last_message_lower)

    print("\n========== AGENT DECISION ==========")

    print(decision)

    print("=====================================\n")

    # ==================================================
    # INITIAL VALUES
    # ==================================================

    action = decision.get("action", "none")

    agent_lead_name = decision.get("lead_name")

    lead_name = None

    lead_results = []

    # ==================================================
    # DETERMINE WHETHER USER EXPLICITLY NAMED A LEAD
    # ==================================================

    explicit_agent_lead = False

    if agent_lead_name:

        agent_lead_lower = agent_lead_name.strip().lower()

        if agent_lead_lower in last_message_lower:

            explicit_agent_lead = True

    # ==================================================
    # IMPORTANT MEMORY RULE
    # ==================================================
    #
    # If the user says:
    #
    # "write an email"
    #
    # and current lead is Sudhan,
    #
    # but Ollama randomly returns:
    #
    # lead_name = Sneha
    #
    # we IGNORE Sneha because the user never mentioned Sneha.
    #
    # The remembered lead wins.
    #
    # ==================================================

    if remembered_lead and not explicit_agent_lead:

        lead_name = remembered_lead

        print("Using remembered lead:", remembered_lead)

    elif explicit_agent_lead:

        lead_name = agent_lead_name

        print("Using explicitly mentioned lead:", lead_name)

    # ==================================================
    # CONFIRMATION HANDLING
    # ==================================================

    confirmation_words = [
        "yes",
        "yeah",
        "yep",
        "sure",
        "okay",
        "ok",
        "do it",
        "go ahead",
        "please do",
        "sounds good",
        "that's good",
        "that works",
        "please",
    ]

    if last_message_lower in confirmation_words and pending_action:

        action = pending_action

        lead_name = remembered_lead

        print("Continuing pending action:", pending_action)

        print("Using remembered lead:", remembered_lead)

    # ==================================================
    # SPECIAL CASE:
    # USER ASKS FOR EMAIL / WHATSAPP / CALL
    #
    # If the current lead exists, force that lead.
    # ==================================================

    generation_actions = [
        "generate_email",
        "generate_whatsapp",
        "generate_call_script",
    ]

    if action in generation_actions:

        if remembered_lead and not explicit_agent_lead:

            lead_name = remembered_lead

            print("Generation request detected.")

            print("Agent supplied:", agent_lead_name)

            print("User did not explicitly name that lead.")

            print("Therefore using remembered lead:", remembered_lead)

    # ==================================================
    # SEARCH CRM
    # ==================================================

    if lead_name:

        print("Searching CRM for:", lead_name)

        lead_results = search_lead(lead_name)

    print("Lead Results:", lead_results)

    # ==================================================
    # LIST LEADS
    # ==================================================

    if action == "list_leads":

        all_leads = get_all_leads()

        messages.append(
            {
                "role": "system",
                "content": f"""

CURRENT CRM DATABASE

{all_leads}

Use ONLY this CRM data when answering.

Do not invent leads or information.

""",
            }
        )

    # ==================================================
    # NO LEAD FOUND
    # ==================================================

    if action != "list_leads" and action != "none" and not lead_results:

        if lead_name:

            return ChatResponse(
                response=(
                    f"I couldn't find a CRM lead named "
                    f"'{lead_name}'. Please check the name."
                ),
                lead_name=None,
                pending_action=None,
            )

        else:

            return ChatResponse(
                response=("I need to know which CRM lead you want " "me to work with."),
                lead_name=None,
                pending_action=None,
            )

    # ==================================================
    # UPDATE LEAD
    # ==================================================

    if action == "update_lead":

        lead = lead_results[0]

        field = decision.get("field")

        value = decision.get("value")

        allowed_fields = [
            "name",
            "company",
            "phone",
            "email",
            "source",
            "status",
            "notes",
        ]

        if field not in allowed_fields:

            return ChatResponse(
                response=(
                    "I can only update "
                    "name, company, phone, email, "
                    "source, status, or notes."
                ),
                lead_name=lead["name"],
                pending_action=None,
            )

        lead[field] = value

        update_lead(lead["id"], lead)

        return ChatResponse(
            response=(f"{lead['name']} " f"updated successfully."),
            lead_name=lead["name"],
            pending_action=None,
        )

    # ==================================================
    # DELETE LEAD
    # ==================================================

    if action == "delete_lead":

        lead = lead_results[0]

        delete_lead(lead["id"])

        return ChatResponse(
            response=(f"{lead['name']} " f"deleted successfully."),
            lead_name=lead["name"],
            pending_action=None,
        )

    # ==================================================
    # CONVERT LEAD
    # ==================================================

    if action == "convert_lead":

        lead = lead_results[0]

        convert_lead(lead["id"])

        return ChatResponse(
            response=(f"{lead['name']} " f"converted successfully."),
            lead_name=lead["name"],
            pending_action=None,
        )

    # ==================================================
    # GENERATE EMAIL
    # ==================================================

    if action == "generate_email":

        lead = lead_results[0]

        print("Generating email for:", lead["name"])

        lead_request = build_lead_request(lead)

        email = generate_email(lead_request)

        print("\n========== GENERATED EMAIL ==========")

        print(email)

        print("=====================================\n")

        # ----------------------------------------------
        # SAFE RESPONSE HANDLING
        # ----------------------------------------------

        subject = get_email_field(email, "subject")

        greeting = get_email_field(email, "greeting")

        body = get_email_field(email, "body")

        closing = get_email_field(email, "closing")

        return ChatResponse(
            response=f"""
Subject: {subject}

{greeting}

{body}

{closing}
""",
            lead_name=lead["name"],
            pending_action=None,
        )

    # ==================================================
    # GENERATE WHATSAPP
    # ==================================================

    if action == "generate_whatsapp":

        lead = lead_results[0]

        print("Generating WhatsApp message for:", lead["name"])

        lead_request = build_lead_request(lead)

        whatsapp = generate_whatsapp(lead_request)

        print("\n========== GENERATED WHATSAPP ==========")

        print(whatsapp)

        print("========================================\n")

        whatsapp_message = get_whatsapp_message(whatsapp)

        return ChatResponse(
            response=whatsapp_message,
            lead_name=lead["name"],
            pending_action=None,
        )

    # ==================================================
    # GENERATE CALL SCRIPT
    # ==================================================

    if action == "generate_call_script":

        lead = lead_results[0]

        print("Generating call script for:", lead["name"])

        lead_request = build_lead_request(lead)

        script = generate_call_script(lead_request)

        print("\n========== GENERATED CALL SCRIPT ==========")

        print(script)

        print("===========================================\n")

        call_script = get_call_script(script)

        return ChatResponse(
            response=call_script,
            lead_name=lead["name"],
            pending_action=None,
        )

    # ==================================================
    # INJECT CRM RECORD INTO AI
    # ==================================================

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

Use it whenever answering the user's question.

Never invent CRM information.

Do not ask the user for information that
is already available here.

""",
        }

        messages.append(crm_context)

    # ==================================================
    # CONVERSATION HISTORY
    # ==================================================

    for msg in request.messages:

        messages.append({"role": msg.role, "content": msg.content})

    # ==================================================
    # DEBUG
    # ==================================================

    print("\n========== PROMPT TO OLLAMA ==========")

    for message in messages:

        print("----------------------------------")

        print(message["role"])

        print(message["content"])

    print("======================================\n")

    # ==================================================
    # OLLAMA
    # ==================================================

    response = ollama.chat(model="llama3.2", messages=messages)

    ai_response = response["message"]["content"]

    print("\nAI Response:")

    print(ai_response)

    # ==================================================
    # RETURN
    # ==================================================

    return ChatResponse(
        response=ai_response,
        lead_name=lead_name,
        pending_action=None,
    )


# ==================================================
# CHAT TITLE
# ==================================================


@app.post("/chat-title")
def chat_title(data: dict):

    title = generate_chat_title(data["message"])

    return {"title": title}
