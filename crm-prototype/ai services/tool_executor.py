import requests

BACKEND = "http://localhost:5000/api/tools"


def search_lead(name):

    response = requests.get(
        f"{BACKEND}/search/{name}"
    )

    if response.status_code == 200:
        return response.json()

    return []


def update_lead(id, lead):

    response = requests.put(
        f"{BACKEND}/update/{id}",
        json=lead
    )

    return response.json()


def delete_lead(id):

    response = requests.delete(
        f"{BACKEND}/delete/{id}"
    )

    return response.json()


def convert_lead(id):

    response = requests.put(
        f"{BACKEND}/convert/{id}"
    )

    return response.json()


def get_all_leads():

    response = requests.get(f"{BACKEND}/all")

    if response.status_code == 200:
        return response.json()

    return []
