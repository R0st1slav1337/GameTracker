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

### Authentication
* User registration
* User login/logout

### Game Library
* Search for games from a large library of games, which will be extracted from the external API (rawg.io)
* View details about every game
* Add games to favorites
* Add games to played/playing/want to play list, which will be seen in profile

### Reviews
* View reviews of games
* Leave own review on game

### Profile
* Create and view profile with lists of games (favorites, played, playing, want to play)
* Edit profile information
* View others' profiles and their game lists and reviews

## End Points (planned)

* POST   /api/auth/login/
* POST   /api/auth/register/
* POST   /api/auth/logout/

* GET    /api/games/
* GET    /api/games/<id>/
* POST   /api/games/
* GET    /api/external/games/

* GET    /api/library/
* POST   /api/library/
* PUT    /api/library/<id>/
* DELETE /api/library/<id>/

* GET    /api/reviews/?game=1
* POST   /api/reviews/
* PUT    /api/reviews/<id>/
* DELETE /api/reviews/<id>/

* GET    /api/profiles/<username>/
* GET    /api/profiles/<username>/reviews/
* GET    /api/profiles/<username>/library/