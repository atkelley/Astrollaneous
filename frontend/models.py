from django.db import models
import misaka


class Satellite(models.Model):
  acronym = models.CharField(max_length=200)
  title = models.CharField(max_length=200)
  image_url = models.CharField(max_length=200, null=True, blank=True)
  created_date = models.DateTimeField(auto_now_add=True)
  text = models.TextField()
  text_html = models.TextField(null=True, editable=False)

  def __str__(self):
    return self.acronym

  def save(self, *args, **kwargs):
    self.text_html = misaka.html(self.text)
    super().save(*args, **kwargs)

  class Meta:
    ordering = ["-created_date"]
