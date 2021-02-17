from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class User(User):
  User._meta.get_field('email').blank = False

  def __str__(self):
    return "@{}".format(self.username)
