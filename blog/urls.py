from django.urls import path
from blog import views

app_name = 'blog'

urlpatterns = [
    path('', views.PostList.as_view(), name='blog'),
    path('drafts/', views.DraftListView.as_view(), name='drafts'),
    path('create/', views.CreatePostView.as_view(), name='create'),
    path("by/<username>/<int:pk>/", views.PostDetail.as_view(), name="single"),


    path('post/<int:pk>/edit/', views.PostUpdateView.as_view(), name='post_edit'),

    path('post/<int:pk>/remove/', views.PostDeleteView.as_view(), name='post_remove'),
    path('post/<int:pk>/publish/', views.post_publish, name='post_publish'),
    path('post/<int:pk>/comment/', views.add_comment_to_post, name='add_comment_to_post'),
    path('comment/<int:pk>/approve/', views.comment_approve, name='comment_approve'),
    path('comment/<int:pk>/remove/', views.comment_remove, name='comment_remove'),
]
