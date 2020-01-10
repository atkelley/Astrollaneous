from django.core.mail import BadHeaderError, send_mail
from django.shortcuts import render, redirect
from django.urls import reverse, reverse_lazy
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic import TemplateView, FormView
from .forms import ContactForm
from django.contrib import messages
import requests

# Create your views here.
def contact(request):
    if request.method == 'GET':
        form = ContactForm()
    else:
        form = ContactForm(request.POST)
        if form.is_valid():
            subject = form.cleaned_data['subject']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
            try:
                send_mail(subject, message, email, ['kelley.andrew.t@gmail.com'])
            except BadHeaderError:
                messages.error(request, "Invalid header found!")
                return HttpResponse('Invalid header found!')
            messages.success(request, "Thank you for your message! Someone will get back to you within 24 hours.")
            return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
    return render(request, "contact.html", {'form': form})

class AboutView(TemplateView):
    template_name = 'about.html'

class HomeView(TemplateView):
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

def about(request):
    context = {}
    telescopes = []
    telescope_feeds = {
        'European Space Agency Hubble News': {
            'feed': 'esa_feed/',
            'section_title': 'All Things Space-Related',
            'section_text': 'This website is an aggregate of various resources that the modern, amateur astronomist ' +
            'would utilize in pursuing their interest in all things space-related. The "Mars" page compiles photos for the ' +
            'the three most widely-known rovers (Curiosity, Opportunity & Spirit), in addition to tracking current weather patterns ' +
            'on the famous Red planet. The "NEOs" page can show the user current where-abouts and trajectories ' +
            'of various "Near Earth Objects" (comets, meteorites, etc.), and classify which are potential dangers to Earth and estimate ' +
            'their times of impact. The "Satellites" page is a comprehensive tool for identifying the myriad, man-made devices orbiting our planet ' +
            'and describes what they do and who they belong to. "Space Weather" forecasts what to expect, in terms of space-related weather ' +
            '(solar wind, flares, etc.) and how that can effect the performance of our aforementioned, man-made objects. The "NASA" page is ' +
            'comprehensive searching tool of NASA\'s images and video archives and "Techport" is a page dedicated to highlighting some of NASA\'s ' +
            'most interesting, current technologies being developed.'
        },
        'James Webb Space Telescope': {
            'feed': 'jwst_feed/',
            'section_title': 'Django & Bootstrap',
            'section_text': 'This website (version 1.0.1) was created with Python (version 3.8.0), Django (version 3.0.1), Bootstrap4, HTML5 and CSS3. ' +
            'It consumes from various NASA and Hubble telescope APIs, using Python\'s requests library. This website was conceived as a project to learn more about Django ' +
            'Full Stack Development, and pursue a life-long goal of learning more about astronomy. Originally, it was a blog project from an online course, ' +
            'designed to demonstrate the basic MVT structure of Django. That component is now used to log the progress of this website\'s continous development, ' +
            'as well as, journal various points of interest related to astronomy. It is a long-term goal to refine this website\'s content ' +
            'further and enhance its functionality to attract paid memberships and ad placements (via Google Adsense, affiliate marketing, etc.).'
        },
        'Space Telescope Live': {
            'feed': 'st_live/',
            'section_title': 'Who We Are',
            'section_text': 'We are a group of space-enthusiasts who met through a Web Development Full Stack Bootcamp in Boston. This bootcamp focused on the basics (HTML, CSS, Javascript) ' +
            'and introduced us to many different Javascript libraries, like Node.js (a runtime environment), Mustache.js (a templating library) and React.js (a front-end framework). Additionally, ' +
            'we were exposed to both MySQL and Mongo/Mongoose database management systems, JSON, AJAX, Bootstrap, Heroku and APIs. Future plans include experimenting with putting Angular and Java into ' +
            'this architecture, as well as incorporating cloud development (most likely through AWS) when launching this website to its permanent online location. For questions or additional ' +
            'information, feel free to reach out to us through our contact form in the header of this website.'
        }
    }

    base_url = "https://hubblesite.org/api/v3/external_feed/"

    for key, value in telescope_feeds.items():
        response = requests.get(base_url + value['feed'])
        telescope_data = response.json()
        if value['feed'] == 'esa_feed/':
            title = telescope_data[0]['title'].split(": ")[1]
        else:
            title = telescope_data[0]['title']
        telescope_object = {
            "feed": key,
            "title": title,
            "article_url": telescope_data[0]['link'],
            "section_title": value['section_title'],
            "section_text": value['section_text'],
            "thumbnail_large_url": "https:" + telescope_data[0]['thumbnail_large'],
            "image_square_large_url": "https:" + telescope_data[0]['image_square_large']
        }
        telescopes.append(telescope_object)

    return render(request, 'about.html', {"telescopes": telescopes})
