# Game Tracker

## Team members

* Krivenko Rostislav
* Nurkhassimova Aruzhan

## Technologies
### Frontend
* Angular
* HTML, CSS
* HttpClient

### Backend
* Django
* Django REST Framework


## Planed Features

* User registration
* User login/logout
* Search for games from a large library of games, which will be extracted from the external API (rawg.io)
* View details about every game
* Add games to favorites
* Add games to played/playing/want to play list, which will be seen in profile
* Leave own review on game

## End Points (planned)

* POST   /api/auth/login/
* POST   /api/auth/register/
* POST   /api/auth/logout/

* GET    /api/games/
* GET    /api/games/<id>/
* POST   /api/games/
* GET    /api/external/games/

* GET    /api/my-library/
* POST   /api/my-library/
* PUT    /api/my-library/<id>/
* DELETE /api/my-library/<id>/

* GET    /api/reviews/?game=1
* POST   /api/reviews/
* PUT    /api/reviews/<id>/
* DELETE /api/reviews/<id>/
