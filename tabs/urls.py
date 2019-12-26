from django.urls import path
from tabs import views

urlpatterns = [
    path('', views.home, name='home'),
    path('mars/', views.mars, name='mars'),
    path('mars/<str:rover_name>/', views.rover, name='rover'),
    path('mars/search/', views.search, name='search'),
    path('neos/', views.neos, name='neos'),
    path('satellites/', views.satellites, name='satellites'),
    path('weather/', views.weather, name='weather'),
    path('nasa/', views.nasa, name='nasa'),
    path('techport/', views.techport, name='techport'),
]
