import axios from "axios";

export async function generateCallScript(lead) {

    const response = await axios.post(
        "http://127.0.0.1:8000/generate-call-script",
        lead
    );

    return response.data;

}