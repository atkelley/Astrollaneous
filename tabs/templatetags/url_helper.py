from django import template
import requests

register = template.Library()

@register.simple_tag
def get_video_url(urls):
  response = requests.get(urls)
  data = response.json()
  url = None

  for value in data:
    if '~orig.mp4' in value:
      url = value.replace(" ", "%20").replace("“", '"').replace("”", '"')
  
  return url

@register.simple_tag
def get_image_url(urls):
  response = requests.get(urls)
  data = response.json()

  for url in data:
    if '~orig.jpg' in url or '~Large.jpg' in url or '~large.jpg' in url or '~medium.jpg' in url:
      return url.replace(" ", "%20").replace("“", '"').replace("”", '"')
  
  return ""

@register.simple_tag
def get_audio_url(urls):
  response = requests.get(urls)
  data = response.json()

  for url in data:
    if '~orig.mp3' in url or '~orig.wav' in url:
      return url.replace(" ", "%20").replace("“", '"').replace("”", '"')
  
  return ""