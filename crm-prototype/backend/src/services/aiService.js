import axios from "axios";

export async function analyzeLead(lead) {
    const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        lead
    );

    return response.data;
}