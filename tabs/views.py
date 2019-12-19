from django.urls import reverse
from django.http import HttpResponseRedirect
from django.views.generic import TemplateView
from django.shortcuts import render
from datetime import date
import requests

def home(request):
    response = requests.get('https://api.nasa.gov/planetary/apod?api_key=suY5NhcHycX1CIkDaMCXNdY8dIYdp0O5meo3cJso')
    daily_image_data = response.json()
    context = {
        "home_page": "active",
        "date": date.today(),
        "title": daily_image_data['title'],
        "description": daily_image_data['explanation'],
        "image_url": daily_image_data['hdurl'],
    }
    return render(request, 'index.html', context)

def mars(request):
    context = {"mars_page": "active"}
    return render(request, 'mars.html', context)

def neos(request):
    context = {"neos_page": "active"}
    return render(request, 'neos.html', context)

def satellites(request):
    context = {"satellites_page": "active"}
    return render(request, 'satellites.html', context)

def weather(request):
    context = {"weather_page": "active"}
    return render(request, 'weather.html', context)

def nasa(request):
    context = {"nasa_page": "active"}
    return render(request, 'nasa.html', context)

def techport(request):
    context = {"techport_page": "active"}
    return render(request, 'techport.html', context)

def about(request):
    context = {"about_page": "active"}
    return render(request, 'about.html', context)

def contact(request):
    context = {"contact_page": "active"}
    return render(request, 'contact.html', context)

class TestPage(TemplateView):
    template_name = 'test.html'

class ThanksPage(TemplateView):
    template_name = 'thanks.html'

class AboutTab(TemplateView):
    template_name = 'about.html'

class HomeTab(TemplateView):
    template_name = 'index.html'

    def get(self, request, *args, **kwargs):
        response = requests.get('https://api.nasa.gov/planetary/apod?api_key=suY5NhcHycX1CIkDaMCXNdY8dIYdp0O5meo3cJso')
        daily_image_data = response.json()
        kwargs['date'] = daily_image_data['date']
        kwargs['title'] = daily_image_data['title']
        kwargs['description'] = daily_image_data['explanation']
        kwargs['image_url'] = daily_image_data['hdurl']

        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse("test"))
        return super().get(request, *args, **kwargs)

class ContactTab(TemplateView):
    pass
