from datetime import datetime
from .models import Game

def save_rawg_game(data):
    if data is None:
        raise ValueError("Rawg returned None")

    released = data.get("released")
    parsed_release_date = None

    if released:
        try:
            parsed_release_date = datetime.strptime(released, "%Y-%m-%d").date()
        except ValueError:
            parsed_release_date = None

    genres = ", ".join([g["name"] for g in data.get("genres", []) if "name" in g])

    game, created = Game.objects.update_or_create(
        rawg_id = data["id"],
        defaults={
            "title": data.get("name", ""),
            "description": data.get("description_raw", "") or data.get("description", ""),
            "release_date": parsed_release_date,
            "rating": data.get("rating"),
            "image": data.get("background_image", ""),
            "genres": genres,
            "slug": data.get("slug", "")
        }
    )
    return game