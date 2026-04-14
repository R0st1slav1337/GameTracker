import requests
from django.conf import settings

BASE_URL = "https://api.rawg.io/api"

def search_rawg_games(query, page=1, page_size=10):
    response = requests.get(
        f"{BASE_URL}/games",
        params={
            "key": settings.RAWG_API_KEY,
            "search": query,
            "page": page,
            "page_size": page_size,
        },
        timeout=10
    )
    response.raise_for_status()
    return response.json()

def get_rawg_game(rawg_id):
    response = requests.get(
        f"{BASE_URL}/games/{rawg_id}",
        params={"key": settings.RAWG_API_KEY},
        timeout=10
    )
    response.raise_for_status()
    return response.json()