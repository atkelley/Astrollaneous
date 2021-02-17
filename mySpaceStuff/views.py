from django.core.mail import BadHeaderError, send_mail
from django.shortcuts import render, redirect
from django.urls import reverse, reverse_lazy
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from .forms import ContactForm
from django.contrib import messages
import requests

import datetime, requests, random, json, urllib, pytz, re, tle2czml
from rest_framework.response import Response
from rest_framework.decorators import api_view

from frontend.models import Satellite

@api_view(['GET'])
def satellite(request, name):
  if request.method == "GET":
    satellites = list(Satellite.objects.values())
    satellites_list = [entry for entry in satellites]

    result = None
    for satellite in satellites_list:
      for key, value in satellite.items():
        if key == 'acronym' and value == name:
          result = satellite
          break

    base_url = "https://celestrak.com/NORAD/elements/{}.txt".format(name)

    r = requests.get(base_url)
    input_file = "static/mySpaceStuff/tle2czml/tle_{}.txt".format(name)

    with open(input_file, 'wb') as f:
        f.write(r.content)
    f.close()

    output_file = "static/mySpaceStuff/tle2czml/tle_{}.czml".format(name)
    tle2czml.create_czml(input_file, outputfile_path=output_file)
    return JsonResponse(result, safe=False)


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