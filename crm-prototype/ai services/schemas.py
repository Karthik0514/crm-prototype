from typing import List
from pydantic import BaseModel


# -----------------------------
# Lead Models
# -----------------------------

class LeadRequest(BaseModel):
    name: str
    company: str
    phone: str
    email: str
    source: str
    status: str
    notes: str


class LeadAnalysis(BaseModel):
    lead_score: int
    priority: str
    buying_intent: str
    summary: str
    next_action: str


# -----------------------------
# Email
# -----------------------------

class EmailResponse(BaseModel):
    subject: str
    greeting: str
    body: str
    closing: str


# -----------------------------
# WhatsApp
# -----------------------------

class WhatsAppResponse(BaseModel):
    message: str


# -----------------------------
# Call Script
# -----------------------------

class CallScriptResponse(BaseModel):
    script: str


# -----------------------------
# AI Chat
# -----------------------------

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):

    messages: List[ChatMessage]

    lead: LeadRequest | None = None

    current_lead: str | None = None

    pending_action: str | None = None


class ChatResponse(BaseModel):

    response: str

    lead_name: str | None = None

    pending_action: str | None = None


from typing import Optional

class AgentAction(BaseModel):
    action: str
    lead_name: Optional[str] = None
    field: Optional[str] = None
    value: Optional[str] = None
    response: str
