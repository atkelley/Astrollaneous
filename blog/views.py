from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
# from braces.views import SelectRelatedMixin
from django.urls import reverse_lazy
from django.utils import timezone
from django.contrib import messages
from django.views.generic import (TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView, FormView)
from bootstrap_modal_forms.generic import (BSModalCreateView,
                                           BSModalUpdateView,
                                           BSModalReadView,
                                           BSModalDeleteView)
from .models import Post, Comment
from .forms import PostForm, CommentForm


from django.core import serializers
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Post
from .serializers import PostSerializer, CommentSerializer
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

# POSTS ###################################################################################
@api_view(['GET'])
def posts(request):
  if request.method == 'GET':
    try:
      data = Post.objects.all()
      serializer = PostSerializer(data, context={'request': request}, many=True)
      return Response(serializer.data)
    except Post.DoesNotExist: 
      return JsonResponse({'error': 'Posts not found.'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['POST'])
def create_post(request):
  if request.method == 'POST':
    try:
      data = JSONParser().parse(request)
      title = data.get('title')
      text = data.get('text')
      image_url = data.get('image_url')
      user_data = data.get('user')
      user = User.objects.get(id=user_data.get('id'))
      post = Post(title=title, text=text, image_url=image_url, user=user)
      post.save()
      return HttpResponse(status=200)
    except Post.ParseError(detail=None, code=None): 
        return JsonResponse({'error': 'Post could not be created.'}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
def get_post(request, id):
  try: 
    post = Post.objects.filter(id=id).values()
    return JsonResponse({"post": list(post)[0]})
  except Post.DoesNotExist: 
      return JsonResponse({'error': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['PUT'])
def update_post(request, id):
  try:
    data = JSONParser().parse(request)
    post = Post.objects.get(id=id)
    post.title = data.get('title')
    post.text = data.get('text')
    post.image_url = data.get('image_url')
    post.save(update_fields=['title', 'text', 'text_html', 'image_url'])
    return HttpResponse(status=200)
  except Exception as e:
    return HttpResponse(e, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['DELETE'])
def delete_post(request, id):
  try:
    Post.objects.filter(id=id).delete()
    return HttpResponse(status=200)
  except Exception as e:
    return HttpResponse(e, status=status.HTTP_400_BAD_REQUEST)


# COMMENTS #################################################################################
@csrf_exempt
@api_view(['POST'])
def create_comment(request):
  if request.method == 'POST':
    try:
      data = JSONParser().parse(request)
      pk = data.get('postId')
      text = data.get('commentText')
      user_data = data.get('user')
      user = User.objects.get(id=user_data.get('id'))
      post = get_object_or_404(Post, pk=pk)
      comment = Comment(post=post, user=user, text=text)
      comment.save()
      return HttpResponse(status=200)
    except Post.ParseError(detail=None, code=None): 
        return JsonResponse({'error': 'Post could not be created.'}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
def get_comment(request, id):
  try: 
    post = Post.objects.filter(id=id).values()
    return JsonResponse({"post": list(post)[0]})
  except Post.DoesNotExist: 
      return JsonResponse({'error': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['PUT'])
def update_comment(request, id):
  try:
    data = JSONParser().parse(request)
    comment = Comment.objects.get(id=id)
    comment.text = data.get('commentText')
    comment.save(update_fields=['text'])
    return HttpResponse(status=200)
  except Exception as e:
    return HttpResponse(e, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['DELETE'])
def delete_comment(request, id):
  try:
    Comment.objects.filter(id=id).delete()
    return HttpResponse(status=200)
  except Exception as e:
    return HttpResponse(e, status=status.HTTP_400_BAD_REQUEST)


# USER ##################################################################################
@api_view(['GET'])
def get_user(request, id):
  if request.method == 'GET':
    try:
      user_data = User.objects.get(id=id)
      user = serializers.serialize('python', [user_data,])
      return Response(user)
    except User.DoesNotExist: 
      return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def user_posts(request, id):
  if request.method == 'GET':
    try:
      user = User.objects.get(id=id)
      data = Post.objects.filter(user=user)
      serializer = PostSerializer(data, context={'request': request}, many=True)
      return Response(serializer.data)
    except Post.DoesNotExist: 
      return JsonResponse({'error': 'Posts not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def user_comments(request, id):
  if request.method == 'GET':
    try:
      user = User.objects.get(id=id)
      data = Comment.objects.filter(user=user)
      serializer = CommentSerializer(data, context={'request': request}, many=True)
      return Response(serializer.data)
    except Comment.DoesNotExist: 
      return JsonResponse({'error': 'Comments not found.'}, status=status.HTTP_404_NOT_FOUND)


class PostList(ListView):
    model = Post
    select_related = ("user",)

class BlogView(ListView):
    model = Post
    my_timezone = 'America/Toronto'

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        return data

    def get_queryset(self):
        return Post.objects.filter(created_date__lte=timezone.now()).order_by('-created_date')

class PostCreateView(LoginRequiredMixin, CreateView):
    login_url = '/login/'
    success_url = reverse_lazy('blog:post_list')
    form_class = PostForm
    model = Post

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['cancel_url'] = self.request.META.get('HTTP_REFERER', '/')
        data['form_title'] = "Create Post"
        return data

    def form_valid(self, form):
        messages.success(self.request, 'You have successfully posted to the blog.')
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.save()
        return super().form_valid(form)

class PostEditView(LoginRequiredMixin, UpdateView):
    login_url = '/login/'
    success_url = reverse_lazy('blog:post_list')
    form_class = PostForm
    model = Post

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['cancel_url'] = self.request.META.get('HTTP_REFERER', '/')
        data['form_title'] = "Edit Post"
        return data

    def form_valid(self, form):
        messages.success(self.request, 'You have successfully updated your post.')
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.save()
        return super().form_valid(form)

class PostDeleteView(LoginRequiredMixin, BSModalDeleteView):
    model = Post
    template_name = 'blog/post_confirm_delete.html'
    success_message = 'You have successfully deleted your post from the blog.'
    success_url = reverse_lazy('blog:post_list')

# @login_required
# def add_comment_to_post(request, username, pk):
#     post = get_object_or_404(Post, pk=pk)
#     if request.method == "POST":
#         form = CommentForm(request.POST)
#         if form.is_valid():
#             comment = form.save(commit=False)
#             comment.author = username
#             comment.post = post
#             comment.save()
#             messages.success(request, "You have successfully commented to the post.")
#             return redirect(request.META.get('HTTP_REFERER', 'post_list'))
#     else:
#         form = CommentForm()
#     return render(request, 'blog/comment_form.html', {'form': form, 'form_title': "Add Comment"})

# class CommentCreateView(LoginRequiredMixin, BSModalCreateView):
#     login_url = '/login/'
#     redirect_field_name = 'blog/post_list.html'
#     form_class = CommentForm
#     model = Comment
#
#     def get_context_data(self, **kwargs):
#         data = super().get_context_data(**kwargs)
#         data['form_title'] = "Add Comment"
#         return data
#
#     def form_valid(self, form):
#         self.object = form.save(commit=False)
#         self.object.user = self.request.user
#         self.object.save()
#         return super().form_valid(form)
#
#     def get_success_url(self):
#         messages.success(self.request, "You have successfully commented to the post.")
#         return reverse_lazy('blog:post_list')

class CommentEditView(LoginRequiredMixin, UpdateView):
    login_url = '/login/'
    redirect_field_name = 'blog/post_list.html'
    form_class = CommentForm
    model = Comment

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['form_title'] = "Edit Comment"
        return data

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.save()
        return super().form_valid(form)

    def get_success_url(self):
        messages.success(self.request, "You have successfully updated your comment.")
        return reverse_lazy('blog:post_list')

class CommentDeleteView(LoginRequiredMixin, BSModalDeleteView):
    model = Comment
    template_name = 'blog/comment_confirm_delete.html'
    success_message = 'You have successfully deleted your comment from the post.'
    success_url = reverse_lazy('blog:post_list')
