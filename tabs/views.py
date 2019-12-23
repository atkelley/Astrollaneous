from django.urls import reverse
from django.http import HttpResponseRedirect
from django.views.generic import TemplateView
from django.shortcuts import render
import datetime
import requests

API_KEY = "suY5NhcHycX1CIkDaMCXNdY8dIYdp0O5meo3cJso"

def home(request):
    video_url = None
    image_url = None
    image_hdurl = None
    copyright = None
    response = requests.get('https://api.nasa.gov/planetary/apod?api_key=' + API_KEY)
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
        "date": datetime.date.today(),
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
    context = {}
    rovers = []
    rover_names = ['curiosity', 'spirit', 'opportunity']
    base_url = "https://api.nasa.gov/mars-photos/api/v1/manifests/"

    for rover in rover_names:
        response = requests.get(base_url + rover + '?api_key=' + API_KEY)
        rover_data = response.json()
        launch_date_time_obj = datetime.datetime.strptime(rover_data['photo_manifest']['launch_date'], '%Y-%m-%d')
        landing_date_time_obj = datetime.datetime.strptime(rover_data['photo_manifest']['landing_date'], '%Y-%m-%d')
        max_date_time_obj = datetime.datetime.strptime(rover_data['photo_manifest']['max_date'], '%Y-%m-%d')
        rover_object = {
            "name": rover_data['photo_manifest']['name'],
            "launch_date": launch_date_time_obj,
            "landing_date": landing_date_time_obj,
            "max_date": max_date_time_obj,
            "status": rover_data['photo_manifest']['status'],
            "total_photos": rover_data['photo_manifest']['total_photos']
        }
        rovers.append(rover_object)

    return render(request, 'tabs/mars.html', {"rovers": rovers})

def rover(request, rover_name):
    context = {"rover_name": rover_name}
    return render(request, 'tabs/rover.html', context)

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
