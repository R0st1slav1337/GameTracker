# Game Tracker

## Team members

* Krivenko Rostislav
* Nurkhassimova Aruzhan
* Rozhkov Kirill

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

### Authentication
* POST   /api/auth/login/
* POST   /api/auth/register/
* POST   /api/auth/logout/
* POST   /api/auth/refresh/

### Games
* GET    /api/games/
* GET    `/api/games/<int:game_id>/`

### Library and Reviews
* GET    /api/library/
* POST   /api/library/
* POST   /api/library/manual/
* PUT    `/api/library/<int:pk>/`
* DELETE `/api/library/<int:pk>/`

* GET    `/api/reviews/?game=<rawg_id>`
* POST   /api/reviews/
* PUT    `/api/reviews/<int:pk>/`
* DELETE `/api/reviews/<int:pk>/`

### Profile
* GET    `/api/profile/<str:username>/`
* GET    `/api/profile/<str:username>/reviews/`
* GET    `/api/profile/<str:username>/library/`
* GET    /api/profile/me/
* PUT    /api/profile/me/