import requests

BACKEND = "http://localhost:5000/api/tools"


def get_headers(token=None):

    if not token:
        return {}

    return {"Authorization": token}


# ======================================================
# SEARCH LEAD
# ======================================================


def search_lead(name, token=None):

    response = requests.get(f"{BACKEND}/search/{name}", headers=get_headers(token))

    print("SEARCH STATUS:", response.status_code)

    print("SEARCH RESPONSE:", response.text)

    if response.status_code == 200:
        return response.json()

    return []


# ======================================================
# GET ALL LEADS
# ======================================================


def get_all_leads(token=None):

    response = requests.get(f"{BACKEND}/all", headers=get_headers(token))

    print("ALL LEADS STATUS:", response.status_code)

    if response.status_code == 200:
        return response.json()

    return []


# ======================================================
# UPDATE LEAD
# ======================================================


def update_lead(id, lead, token=None):

    response = requests.put(
        f"{BACKEND}/update/{id}", json=lead, headers=get_headers(token)
    )

    print("UPDATE STATUS:", response.status_code)

    print("UPDATE RESPONSE:", response.text)

    return response.json()


# ======================================================
# DELETE LEAD
# ======================================================


def delete_lead(id, token=None):

    response = requests.delete(f"{BACKEND}/delete/{id}", headers=get_headers(token))

    print("DELETE STATUS:", response.status_code)

    print("DELETE RESPONSE:", response.text)

    return response.json()


# ======================================================
# CONVERT LEAD
# ======================================================


def convert_lead(id, token=None):

    response = requests.put(f"{BACKEND}/convert/{id}", headers=get_headers(token))

    print("CONVERT STATUS:", response.status_code)

    print("CONVERT RESPONSE:", response.text)

    return response.json()
