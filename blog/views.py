from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework import status

from .serializers import PostSerializer, CommentSerializer
from .models import Post, Comment


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
      post_title = data.get('postTitle')
      text = data.get('commentText')
      user_data = data.get('user')
      user = User.objects.get(id=user_data.get('id'))
      post = get_object_or_404(Post, pk=pk)
      comment = Comment(post=post, post_title=postTitle, user=user, text=text)
      comment.save()
      return HttpResponse(status=200)
    except Comment.ParseError(detail=None, code=None): 
        return JsonResponse({'error': 'Comment could not be created.'}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
def get_comment(request, id):
  try: 
    comment = Comment.objects.filter(id=id).values()
    return JsonResponse({"comment": list(comment)[0]})
  except Comment.DoesNotExist: 
      return JsonResponse({'error': 'Comment not found.'}, status=status.HTTP_404_NOT_FOUND)


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