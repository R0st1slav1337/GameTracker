from django.contrib import admin
from .models import Game, Review, Library, Profile
# Register your models here.

admin.site.register(Game)
admin.site.register(Review)
admin.site.register(Library)
admin.site.register(Profile)