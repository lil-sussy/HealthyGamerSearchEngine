# authentication/urls.py

from django.urls import path
from .views import discord_callback

urlpatterns = [
    path('callback/discord/', discord_callback, name='discord-callback'),
]
