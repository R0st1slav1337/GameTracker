from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/login/', login_view),
    path('auth/register/', register_view),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/logout/', LogoutView.as_view()),

    path('games/', RawgGameListView.as_view()),
    path('games/<int:rawg_id>/', rawg_game_detail_view),
    path('games/search/', rawg_search_view),

    path('reviews/', ReviewListCreate.as_view()),
    path('reviews/<int:pk>/', ReviewDetail.as_view()),

    path('profile/<str:username>/', get_profile),
    path('profile/me/', MyProfileView.as_view()),

    path('library/', LibraryListCreate.as_view()),
    path('library/<int:pk>/', LibraryDetail.as_view()),
    path('library/manual/', ManualLibraryView.as_view()),
]