"""
URL configuration for hgg_searchengine project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include, path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic import RedirectView
from django.urls import path, re_path
import os
from django.views.static import serve
from .settings import BASE_DIR

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # Redirect root to static index.html
    path('', RedirectView.as_view(url='/static/index.html', permanent=False)),
    # Serve the static HTML file
    path('auth/', include('authentication.urls')),
]


# myproject/urls.py


urlpatterns += staticfiles_urlpatterns()
