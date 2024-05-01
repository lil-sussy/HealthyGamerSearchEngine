# authentication/urls.py

from django.urls import path
from .views import return_acces_token
from .views import discord_callback

urlpatterns = [
    path('callback/discord/', discord_callback, name='discord-callback'),
    path('token/', return_acces_token, name='discord-callback'),
]
