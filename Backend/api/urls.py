from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/login/', login_view),
    path('auth/register/', register_view),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/logout/', LogoutView.as_view()),

    path('games/', games_list),
    path('games/<int:game_id>/', game_detail),

    path('reviews/', ReviewListCreate.as_view()),
    path('reviews/<int:pk>/', ReviewDetail.as_view()),

    path('profile/me/', MyProfileView.as_view()),
    path('profile/<str:username>/', get_profile),
    path('profile/<str:username>/reviews/', UserReviewView.as_view()),
    path('profile/<str:username>/library/', UserLibraryView.as_view()),

    path('library/', LibraryListCreate.as_view()),
    path('library/<int:pk>/', LibraryDetail.as_view()),
    path('library/manual/', ManualLibraryView.as_view()),
]