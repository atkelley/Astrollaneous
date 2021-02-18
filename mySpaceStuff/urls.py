"""mySpaceStuff URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
from django.conf import settings
from django.urls import path, include
# from blog import views

from frontend import urls
from accounts import urls
from blog import urls


urlpatterns = [
  path('', include('blog.urls')),
  path('', include('accounts.urls')),
  
  path('', include('frontend.urls')),
  path('blog', include('frontend.urls')),
  path('blog/create', include('frontend.urls')),
  path('blog/update/<int:id>', include('frontend.urls')),
  path('user/<int:id>', include('frontend.urls')),

  path('mars', include('frontend.urls')),
  path('rovers', include('frontend.urls')),
  path('satellites', include('frontend.urls')),
  path('nasa', include('frontend.urls')),
  path('techport', include('frontend.urls')),
  path('about', include('frontend.urls')),
  path('contact', include('frontend.urls')),
  path('login', include('frontend.urls')),
  path('register', include('frontend.urls')),

  path('admin/', admin.site.urls)
]
