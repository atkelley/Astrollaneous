from bootstrap_modal_forms.generic import BSModalCreateView, BSModalLoginView
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.contrib import messages


class RegisterView(BSModalCreateView):
  template_name = 'accounts/register.html'
  form_class = CustomUserCreationForm

  def get_success_url(self):
    messages.success(self.request, 'New user registered. Please log in.')
    return self.request.META.get('HTTP_REFERER', '/')


class LoginView(BSModalLoginView):
  template_name = 'accounts/login.html'
  authentication_form = CustomAuthenticationForm
  success_message = 'You are successfully logged in.'

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['success_url'] = self.request.META.get('HTTP_REFERER', '/')
    return context


def logout(request):
  logout(request)
  messages.success(request, "You are successfully logged out. Come back soon!")
  return redirect(request.META.get('HTTP_REFERER', '/'))
