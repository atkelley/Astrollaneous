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

# Create your views here.
class BlogView(ListView):
    model = Post
    my_timezone = 'America/Toronto'

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['form'] = CommentForm()
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

class PostUpdateView(LoginRequiredMixin, UpdateView):
    login_url = '/login/'
    redirect_field_name = 'blog/post_list.html'
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
    success_message = 'You have successfully deleted your post.'
    success_url = reverse_lazy('blog:post_list')

    def get_success_url(self):
        messages.success(self.request, "You have successfully deleted '" + self.object.title + "' from the blog.")
        return reverse_lazy('blog:post_list')

class CommentCreateView(LoginRequiredMixin, BSModalCreateView):
    login_url = '/login/'
    redirect_field_name = 'blog/post_list.html'
    form_class = CommentForm
    model = Comment

    # def get_context_data(self, **kwargs):
    #     data = super().get_context_data(**kwargs)
    #     return data

    def form_valid(self, form):
        messages.success(self.request, 'You have successfully commented to the post.')
        self.object = form.save(commit=False)
        self.object.user = self.request.user
        self.object.save()
        return super().form_valid(form)

class CommentDeleteView(LoginRequiredMixin, BSModalDeleteView):
    model = Comment
    template_name = 'blog/comment_confirm_delete.html'
    success_message = 'You have successfully deleted your comment.'
    success_url = reverse_lazy('blog:post_list')

    def get_success_url(self):
        messages.success(self.request, "You have successfully deleted your comment.")
        return reverse_lazy('blog:post_list')



# class PostDetail(SelectRelatedMixin, DetailView):
class PostDetail(DetailView):
    model = Post
    select_related = ("user",)

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(
            user__username__iexact=self.kwargs.get("username")
        )

class PostDetailView(DetailView):
    model = Post


class DraftListView(LoginRequiredMixin, ListView):
    login_url = '/login/'
    redirect_field_name = 'blog/post_draft_list.html'
    model = Post

    def get_queryset(self):
        return Post.objects.filter(published_date__isnull=True).order_by('created_date')



# class PostList(SelectRelatedMixin, ListView):
class PostList(ListView):
    model = Post
    select_related = ("user",)



#######################################
## Functions that require a pk match ##
#######################################

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
            return redirect(request.META.get('HTTP_REFERER', 'post_list'))
    else:
        form = CommentForm()
        return render(request, 'blog/comment_form.html', {'form': form})

@login_required
def comment_delete(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    post_pk = comment.post.pk
    comment.delete()
    return redirect(request.META.get('HTTP_REFERER', 'post_list'))



@login_required
def post_publish(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.publish()
    return redirect('post_detail', pk=pk)

@login_required
def comment_approve(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    comment.approve()
    return redirect('post_detail', pk=comment.post.pk)
