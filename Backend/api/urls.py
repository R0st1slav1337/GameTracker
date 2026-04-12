from django.urls import path
from .views import *

urlpatterns = [
    path('auth/login/', login_view),
    path('auth/register/', register_view),

    path('games/', games_list),

    path('reviews/', ReviewListCreate.as_view()),
    path('reviews/<int:pk>/', ReviewDetail.as_view()),

    path('profile/<str:username>/', get_profile),
]