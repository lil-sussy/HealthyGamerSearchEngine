from django.urls import path
from .views import querying_view
from .views import feedback_query

urlpatterns = [
    path('query/', querying_view, name='query'),
    path('feedback/query/', feedback_query),
]
