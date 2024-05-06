from django.urls import path
from .views import querying_view
from .views import feedback_query
from .views import healthcheck

urlpatterns = [
    path('query/', querying_view, name='query'),
    path('feedback/query/', feedback_query),
    path('healthcheck/', healthcheck),
]
