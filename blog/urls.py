from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
  path('api/user/<int:id>', views.get_user),
  path('api/user/<int:id>/posts', views.user_posts),
  path('api/user/<int:id>/comments', views.user_comments),

  path('api/posts', views.posts),
  path('api/posts/<int:id>', views.get_post),
  path('api/posts/create', views.create_post),
  path('api/posts/update/<int:id>', views.update_post),
  path('api/posts/delete/<int:id>', views.delete_post),

  path('api/comments/create', views.create_comment),
  path('api/comments/update/<int:id>', views.update_comment),
  path('api/comments/delete/<int:id>', views.delete_comment),
  path('api/comments/delete/<int:id>', views.delete_comment),
]
