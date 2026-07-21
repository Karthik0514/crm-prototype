from pydantic import BaseModel


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

class EmailResponse(BaseModel):
    subject: str
    greeting: str
    body: str
    closing: str

class WhatsAppResponse(BaseModel):
    message: str