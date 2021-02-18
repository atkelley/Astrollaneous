from rest_framework import serializers 
from .models import Post, Comment
from django.contrib.auth.models import User
from accounts.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  
  class Meta:
    model = Comment
    fields = ('id',
              'post',
              'user',
              'text',
              'created_date')
 
class PostSerializer(serializers.ModelSerializer):
  user = UserSerializer(read_only=True)
  comments = CommentSerializer(many=True, read_only=True)
 
  class Meta:
    model = Post
    fields = ('id',
              'user',
              'title',
              'image_url',
              'created_date',
              'text',
              'text_html',
              'comments')