from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from django.urls import reverse
import misaka

from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Post(models.Model):
    user = models.ForeignKey(User, related_name="blog", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    image_url = models.CharField(max_length=200, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    text = models.TextField()
    text_html = models.TextField(null=True, editable=False)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.text_html = misaka.html(self.text)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("blog:blog")
        # return reverse(
        #     "blog:post_detail",
        #     kwargs={
        #         "username": self.user.username,
        #         "pk": self.pk
        #     }
        # )

    class Meta:
        ordering = ["-created_date"]
        unique_together = ["user", "text"]


class Comment(models.Model):
    post = models.ForeignKey('blog.Post', related_name='comments',on_delete=models.CASCADE)
    author = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    approved_comment = models.BooleanField(default=False)

    def approve(self):
        self.approved_comment = True
        self.save()

    def get_absolute_url(self):
        return reverse("post_list")

    def __str__(self):
        return self.text
