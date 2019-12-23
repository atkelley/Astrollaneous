from django.urls import reverse
from django.http import HttpResponseRedirect
from django.views.generic import TemplateView
from django.shortcuts import render
from datetime import date
import requests

def home(request):
    video_url = None
    image_url = None
    image_hdurl = None
    copyright = None
    response = requests.get('https://api.nasa.gov/planetary/apod?api_key=suY5NhcHycX1CIkDaMCXNdY8dIYdp0O5meo3cJso')
    daily_image_data = response.json()

    if daily_image_data['media_type'] == 'video':
        video_url = daily_image_data['url']
        temp = video_url.split("embed/", 1)[1].split('?')
        image_url = 'http://img.youtube.com/vi/' + temp[0] + '/0.jpg'
    else:
        image_hdurl = daily_image_data['image_hdurl']
        copyright = daily_image_data['copyright']

    context = {
        "home_page": "active",
        "date": date.today(),
        "title": daily_image_data['title'],
        "description": daily_image_data['explanation'],
        "media_type": daily_image_data['media_type'],
        "video_url": video_url,
        "image_url": image_url,
        "image_hdurl": image_hdurl,
        "copyright": copyright
    }
    return render(request, 'tabs/index.html', context)

def mars(request):
    context = {"mars_page": "active"}
    return render(request, 'tabs/mars.html', context)

def neos(request):
    context = {"neos_page": "active"}
    return render(request, 'tabs/neos.html', context)

def satellites(request):
    context = {"satellites_page": "active"}
    return render(request, 'tabs/satellites.html', context)

def weather(request):
    context = {"weather_page": "active"}
    return render(request, 'tabs/weather.html', context)

def nasa(request):
    context = {"nasa_page": "active"}
    return render(request, 'tabs/nasa.html', context)

def techport(request):
    context = {"techport_page": "active"}
    return render(request, 'tabs/techport.html', context)

def about(request):
    context = {"about_page": "active"}
    return render(request, 'tabs/about.html', context)

def contact(request):
    context = {"contact_page": "active"}
    return render(request, 'tabs/contact.html', context)

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
