from django.urls import path
from blog import views

app_name = 'blog'

urlpatterns = [
    path('', views.PostList.as_view(), name='post_list'),
    path('post_create/', views.PostCreateView.as_view(), name='post_create'),
    path('<username>/<int:pk>/post_edit/', views.PostEditView.as_view(), name='post_edit'),
    path('<username>/<int:pk>/post_delete/', views.PostDeleteView.as_view(), name='post_delete'),

    path('<username>/<int:pk>/comment_create/', views.add_comment_to_post, name='comment_create'),
    path('<username>/<int:pk>/comment_edit/', views.CommentEditView.as_view(), name='comment_edit'),
    path('<username>/<int:pk>/comment_delete/', views.CommentDeleteView.as_view(), name='comment_delete'),
]
