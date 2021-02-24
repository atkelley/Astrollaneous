from django.contrib import admin
from .models import Post, Comment

class PostAdmin(admin.ModelAdmin):
  list_display = ('id','user', 'title', 'image_url', 'text', 'created_date')

class CommentAdmin(admin.ModelAdmin):
  list_display = ('id','post', 'user', 'text', 'created_date')


admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)