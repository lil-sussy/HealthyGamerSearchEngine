from django.urls import path
from .views import querying_view

urlpatterns = [
    path('query/', querying_view, name='query'),
]
