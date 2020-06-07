from django import template
import requests, json, urllib
from urllib.error import HTTPError

register = template.Library()

@register.simple_tag
def get_url(category, json_url):
    try:
      response = requests.get(json_url)
      response.raise_for_status()
    except HTTPError as http_err:
      print(f'HTTP error occurred: {http_err}')
    except Exception as err:
      print(f'Other error occurred: {err}')
    else:
      data = response.json()

      if category == 'video':
        return get_video_url(data)
      elif category == 'image':
        return get_image_url(data)
      else:
        return get_audio_url(data)

def get_video_url(data):
  for value in data:
    if '~orig.mp4' in value or '~medium.mp4' in value:
      return value.replace(" ", "%20").replace("“", '"').replace("”", '"')
  return None

def get_image_url(data):
  for value in data:
    if '~orig.jpg' in value or '~Large.jpg' in value or '~large.jpg' in value or '~medium.jpg' in value:
      return value.replace(" ", "%20").replace("“", '"').replace("”", '"')
  return None

def get_audio_url(data):
  for value in data:
    if '~orig.mp3' in value or '~orig.wav' in value:
      return value.replace(" ", "%20").replace("“", '"').replace("”", '"')
  return None