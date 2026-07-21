import axios from "axios";

export async function generateEmail(lead) {

    console.log("Lead being sent to FastAPI:");
    console.log(lead);

    const response = await axios.post(
        "http://127.0.0.1:8000/generate-email",
        lead
    );

    return response.data;
}