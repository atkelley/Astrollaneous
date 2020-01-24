from django.urls import path
from blog import views

app_name = 'blog'

urlpatterns = [
    path('', views.PostList.as_view(), name='blog'),
    path('create/', views.PostCreateView.as_view(), name='create'),
    path('<username>/<int:pk>/', views.PostDetailView.as_view(), name="post_detail"),
    path('<username>/<int:pk>/edit/', views.PostUpdateView.as_view(), name='post_edit'),
    path('<username>/<int:pk>/delete/', views.PostDeleteView.as_view(), name='post_delete'),


    path('drafts/', views.DraftListView.as_view(), name='drafts'),
    path('post/<int:pk>/publish/', views.post_publish, name='post_publish'),

    path('post/<int:pk>/comment/', views.add_comment_to_post, name='add_comment_to_post'),
    path('comment/<int:pk>/approve/', views.comment_approve, name='comment_approve'),
    path('comment/<int:pk>/remove/', views.comment_remove, name='comment_remove'),
]
