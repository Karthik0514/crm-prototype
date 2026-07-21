import axios from "axios";

export async function generateWhatsApp(lead) {

    const response = await axios.post(
        "http://127.0.0.1:8000/generate-whatsapp",
        lead
    );

    return response.data;

}