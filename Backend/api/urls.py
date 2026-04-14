from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/login/', login_view),
    path('auth/register/', register_view),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/logout/', LogoutView.as_view()),

    path('games/', games_list),
    path('games/<int:pk>/', game_detail),
    path('games/search/', rawg_search_view),
    path('games/rawg/<int:rawg_id>/', rawg_game_detail_view),

    path('reviews/', ReviewListCreate.as_view()),
    path('reviews/<int:pk>/', ReviewDetail.as_view()),

    path('profile/<str:username>/', get_profile),
    path('profile/me/', MyProfileView.as_view()),
]