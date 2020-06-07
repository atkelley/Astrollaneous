from django.urls import reverse, reverse_lazy
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.core.cache import cache
import datetime, requests, random, json, urllib, pytz, re
from urllib.error import URLError, HTTPError

API_KEY = "suY5NhcHycX1CIkDaMCXNdY8dIYdp0O5meo3cJso"

def home(request):
    video_url = None
    image_url = None
    image_hdurl = None
    copyright = 'NASA'
    response = requests.get('https://api.nasa.gov/planetary/apod?api_key=' + API_KEY)
    daily_image_data = response.json()

    if 'code' in daily_image_data and daily_image_data['code'] >= 400:
        context = {
            "home_page": "active",
            "date": datetime.date.today(),
            "title": "Chandra Spots a Mega-Cluster of Galaxies in the Making ",
            "description": "Astronomers using data from NASA's Chandra X-ray Observatory and other telescopes have put together a detailed map of a rare collision between four galaxy clusters. Eventually all four clusters — each with a mass of at least several hundred trillion times that of the Sun — will merge to form one of the most massive objects in the universe. Galaxy clusters are the largest structures in the cosmos that are held together by gravity. Clusters consist of hundreds or even thousands of galaxies embedded in hot gas, and contain an even larger amount of invisible dark matter. Sometimes two galaxy clusters collide, as in the case of the Bullet Cluster, and occasionally more than two will collide at the same time. The new observations show a mega-structure being assembled in a system called Abell 1758, located about 3 billion light-years from Earth. It contains two pairs of colliding galaxy clusters that are heading toward one another. Scientists first recognized Abell 1758 as a quadruple galaxy cluster system in 2004 using data from Chandra and XMM-Newton, a satellite operated by the European Space Agency (ESA). Each pair in the system contains two galaxy clusters that are well on their way to merging. In the northern (top) pair seen in the composite image, the centers of each cluster have already passed by each other once, about 300 to 400 million years ago, and will eventually swing back around. The southern pair at the bottom of the image has two clusters that are close to approaching each other for the first time.",
            "image_url": '/static/mySpaceStuff/img/backup_image.jpg',
            "image_hdurl": '/static/mySpaceStuff/img/backup_image_large.jpg',
            "copyright": "X-ray: NASA/CXC/SAO/G.Schellenberger et al.; Optical:SDSS"
        }
        return render(request, 'tabs/index.html', context)

    else:
        if daily_image_data['media_type'] == 'video':
            video_url = daily_image_data['url']
            temp = video_url.split("embed/", 1)[1].split('?')
            image_url = 'http://img.youtube.com/vi/' + temp[0] + '/0.jpg'
        else:
            image_url = daily_image_data['url']
            image_hdurl = daily_image_data['hdurl']

            if hasattr(daily_image_data, 'copyright'):
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
    rovers = []
    rover_names = ['curiosity', 'spirit', 'opportunity']

    for rover_name in rover_names:
        if not cache.get(rover_name):
            base_url = "https://api.nasa.gov/mars-photos/api/v1/manifests/"
            response = requests.get(base_url + rover_name + '?api_key=' + API_KEY)
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
            cache.set(rover_name, rover_object)
        else:
            rovers.append(cache.get(rover_name))

    return render(request, 'tabs/mars.html', {"rovers": rovers})

def get_rover(rover_name):
    # if not cache.get(rover_name):
        cameras = []
        base_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/"
        response = response = requests.get(base_url + rover_name + '/?api_key=' + API_KEY)
        rover_data = response.json()

        landing_date_time_obj = datetime.datetime.strptime(rover_data['rover']['landing_date'], '%Y-%m-%d')
        max_date_time_obj = datetime.datetime.strptime(rover_data['rover']['max_date'], '%Y-%m-%d')
        camera_data = rover_data['rover']['cameras']
        for camera in camera_data:
            camera_object = {camera['name']: camera['full_name']}
            cameras.append(camera)

        rover_object = {
            "rover_name": rover_name,
            "landing_date": landing_date_time_obj,
            "max_date": max_date_time_obj,
            "max_sol": rover_data['rover']['max_sol'],
            "status": rover_data['rover']['status'],
            "total_photos": rover_data['rover']['total_photos'],
            "cameras": cameras
        }

    #     cache.set(rover_name, rover_object)
    # else:
    #     rover_object = cache.get(rover_name)

        return rover_object

def rover(request, rover_name):
    rover_object = get_rover(rover_name)
    return render(request, 'tabs/rover.html', {"rover": rover_object})

def search(request, rover_name):
    date = None
    date_selector = None
    rover_data = None
    rover_object = get_rover(rover_name)

    if request.method == 'POST':
        date_selector = request.POST.getlist('date_selector')
        earth_date = request.POST.get('earth_date')
        sol_date = request.POST.get('sol_date')
        camera_selector = request.POST.get('camera_selector')

        date = {
            'date_selector': request.POST.getlist('date_selector'),
            'earth_date': request.POST.get('earth_date'),
            'sol_date': request.POST.get('sol_date'),
            'camera_selector': request.POST.get('camera_selector'),
        }

        date_parameter = ""
        camera_parameter = ""
        if date_selector[0] == "earth":
            new_earth_date = datetime.datetime.strptime(earth_date, '%m/%d/%Y').strftime('%Y-%m-%d')
            date_parameter = "?earth_date=" + new_earth_date
        if date_selector[0] == "sol":
            date_parameter = "?sol=" + sol_date
        if camera_selector != "none":
            camera_parameter = "&camera=" + camera_selector.lower()


        base_url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos"
        url = base_url + date_parameter + camera_parameter + '&api_key=' + API_KEY
        response = requests.get(base_url + date_parameter + camera_parameter + '&api_key=' + API_KEY)
        rover_data = response.json()

    return render(request, 'tabs/rover.html', {"rover": rover_object, "date": date, "rover_data": rover_data})

def get_collections(nasa_search_data):
  video = []
  image = []
  audio = []

  for item in nasa_search_data['collection']['items']:
    cleaned_date_created_string = re.sub("\+(?P<hour>\d{2}):(?P<minute>\d{2})$", "+\g<hour>\g<minute>" , item['data'][0]['date_created'])
    datetime_object = datetime.datetime.strptime(cleaned_date_created_string, "%Y-%m-%dT%H:%M:%S%z")
    converted_datetime_object = datetime_object.astimezone(pytz.UTC)

    search_object = {
      'title': item['data'][0]['title'],
      'nasa_id': item['data'][0]['nasa_id'],
      'create_date': converted_datetime_object,
      'description': item['data'][0]['description'],
      'json_url': item['href'].replace(" ", "%20").replace("“", '"').replace("”", '"')
    }

    if item['data'][0]['media_type'] == 'audio':
      audio.append(search_object)
    else:
      search_object['preview_image'] = item['links'][0]['href'].replace(" ", "%20").replace("http ", "https").replace("“", '"').replace("”", '"')

      if item['data'][0]['media_type'] == 'image':
        image.append(search_object)
      else:
        video.append(search_object)

  collections = [{"name": "video", "collection": video}, {"name": "image", "collection": image}, {"name": "audio", "collection": audio}]
  return collections

def nasa(request):
  categories = []
  nasa_search_data = None
  nasa_search_input = None

  if request.method == "POST":
    nasa_search_input = request.POST['nasa-search-input'].strip()

    if nasa_search_input:
      base_url = "https://images-api.nasa.gov/search?q="
      response = requests.get(base_url + nasa_search_input)
      nasa_search_data = response.json()
      categories = get_collections(nasa_search_data)

  context = {
    "nasa_page": "active",
    "nasa_search_input": nasa_search_input,
    "categories": categories
  }

  return render(request, 'tabs/nasa.html', context)

def techport(request):
    techport_data = None
    current_date = datetime.datetime.now()
    default_date_object = datetime.datetime(current_date.year - 1, current_date.month, current_date.day)
    default_date = default_date_object.strftime("%Y-%m-%d")

    if request.method == "POST":
        picked_date = request.POST['techport-datepicker']
        if not picked_date:
            picked_date = default_date

        if cache.get('picked_date') != picked_date:
            base_url = "https://api.nasa.gov/techport/api/projects?updatedSince="
            full_url = base_url + picked_date + '&api_key=' + API_KEY
            response = requests.get(base_url + picked_date + '&api_key=' + API_KEY)
            techport_data = response.json()
            cache.set('picked_date', picked_date)
            cache.set('techport_data', techport_data)
        else:
            techport_data = cache.get('techport_data')

    context = {
        "techport_page": "active",
        "default_date": default_date_object,
        "techport_data": techport_data,
    }

    return render(request, 'tabs/techport.html', context)

def techport_search(request, project_id):
    previous = None
    next = None

    if cache.get('techport_data'):
        techport_data = cache.get('techport_data')
        projects = techport_data['projects']['projects']

        for index in range(len(projects)):
            if projects[index]['id'] == project_id:
                if index == 0:
                    next = projects[index+1]
                elif index == len(projects)-1:
                    previous = projects[index-1]
                else:
                    previous = projects[index-1]
                    next = projects[index+1]

        base_url = "https://api.nasa.gov/techport/api/projects/"
        response = response = requests.get(base_url + str(project_id) + '?api_key=' + API_KEY)
        techport_search_data = response.json()
        context = {
            "techport_search_data": techport_search_data,
            "previous": previous,
            "next": next
        }
        return render(request, 'tabs/techport_search.html', context)
    else:
        return redirect(request.META.get('HTTP_REFERER', 'techport'))

def neos(request):
    context = {"neos_page": "active"}
    return render(request, 'tabs/neos.html', context)

def satellites(request):
    context = {"satellites_page": "active"}
    return render(request, 'tabs/satellites.html', context)

def weather(request):
    data = []
    base_url = "https://api.nasa.gov/insight_weather"
    response = response = requests.get(base_url + '/?api_key=' + API_KEY + '&feedtype=json')
    weather_data = response.json()

    context = {"weather_page": "active", "weather_data": weather_data}
    return render(request, 'tabs/weather.html', context)
