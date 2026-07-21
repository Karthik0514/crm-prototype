LEAD_ANALYSIS_PROMPT = """
You are an expert CRM sales assistant.

Analyze the following lead.

Provide:
- Lead score (0-100)
- Priority (Hot, Warm, Cold)
- Buying intent (High, Medium, Low)
- A short summary
- The best next action

Lead Details:

Name: {name}
Company: {company}
Phone: {phone}
Email: {email}
Source: {source}
Status: {status}
Notes: {notes}
"""

EMAIL_PROMPT = """
You are a senior sales executive at Konaseema Sustainable Solutions.

Generate a professional business email.

Lead Details

Name: {name}
Company: {company}
Source: {source}
Status: {status}
Notes: {notes}

Return ONLY valid JSON.

{{
    "subject":"...",
    "body":"..."
}}

The body must contain:

Dear {name},

Thank the customer.

Mention their company.

Explain how Konaseema Sustainable Solutions can help.

Invite them for a discussion or quotation.

End with

Regards,

Sales Team
Konaseema Sustainable Solutions

Never return an email address.

The body should be at least 150 words.
"""

WHATSAPP_PROMPT = """
You are a professional sales representative at Konaseema Sustainable Solutions.

Generate a short, friendly, professional WhatsApp message.

Lead Details

Name: {name}
Company: {company}
Phone: {phone}
Email: {email}
Source: {source}
Status: {status}
Notes: {notes}

Return ONLY valid JSON.

{{
    "message":"..."
}}

Rules:

- Address the customer by name.
- Mention Konaseema Sustainable Solutions.
- Thank them for their interest.
- Mention their requirement if available.
- Ask if they would like a quotation or a call.
- Keep it under 120 words.
"""

CALL_SCRIPT_PROMPT = """
You are an experienced sales representative at Konaseema Sustainable Solutions.

Generate a professional cold-call script for the following lead.

Lead Details

Name: {name}
Company: {company}
Phone: {phone}
Email: {email}
Source: {source}
Status: {status}
Notes: {notes}

Return ONLY valid JSON.

{{
    "script":"..."
}}

Rules:

- Introduce yourself.
- Mention Konaseema Sustainable Solutions.
- Greet the customer by name.
- Mention their company.
- Refer to their inquiry if available.
- Ask open-ended questions.
- Handle objections politely.
- Finish by asking for a meeting or quotation.
- Keep it conversational.
"""