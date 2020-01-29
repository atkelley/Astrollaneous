from django.urls import path
from blog import views

app_name = 'blog'

urlpatterns = [
    path('', views.PostList.as_view(), name='post_list'),
    path('post_create/', views.PostCreateView.as_view(), name='post_create'),
    path('<username>/<int:pk>/edit/', views.PostUpdateView.as_view(), name='post_edit'),
    path('<username>/<int:pk>/post_delete/', views.PostDeleteView.as_view(), name='post_delete'),
    path('<int:pk>/comment_delete/', views.CommentDeleteView.as_view(), name='comment_delete'),
    path('<username>/<int:pk>/comment_create/', views.add_comment_to_post, name='comment_create'),


    # path('<username>/<int:pk>/', views.PostDetailView.as_view(), name="post_detail"),
    # path('drafts/', views.DraftListView.as_view(), name='drafts'),
    # path('post/<int:pk>/publish/', views.post_publish, name='post_publish'),

    # path('post/<int:pk>/comment/', views.add_comment_to_post, name='add_comment_to_post'),
    # path('comment/<int:pk>/approve/', views.comment_approve, name='comment_approve'),

]
