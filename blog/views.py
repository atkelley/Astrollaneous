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
    redirect_field_name = 'blog/post_list.html'
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

@login_required
def add_comment_to_post(request, username, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.author = username
            comment.post = post
            comment.save()
            messages.success(request, "You have successfully commented to the post.")
            return redirect(request.META.get('HTTP_REFERER', 'post_list'))
    else:
        form = CommentForm()
    return render(request, 'blog/comment_form.html', {'form': form, 'form_title': "Add Comment"})

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
