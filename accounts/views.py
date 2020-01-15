from django.contrib.auth import login, logout, authenticate
from django.urls import reverse_lazy
from bootstrap_modal_forms.generic import BSModalCreateView, BSModalLoginView
from django.http import HttpResponse, HttpResponseRedirect
from .forms import CustomUserCreationForm, CustomAuthenticationForm

# Create your views here.
class RegisterView(BSModalCreateView):
    template_name = 'accounts/register.html'
    form_class = CustomUserCreationForm
    success_message = 'Success: New user registered. Please log in.'
    success_url = reverse_lazy('login')

class SignUpView(BSModalCreateView):
    template_name = 'accounts/signup.html'
    form_class = CustomUserCreationForm
    success_message = 'Success: New user registered. Please log in.'
    success_url = reverse_lazy('login')

class LoginView(BSModalLoginView):
    template_name = 'accounts/login.html'
    authentication_form = CustomAuthenticationForm
    success_message = 'Success: You are successfully logged in.'
    # extra_context = dict(success_url=self.request.META['HTTP_REFERER'])
    # self.request.META['HTTP_REFERER']
    extra_context = dict(success_url=reverse_lazy('tabs:home'))

class ComboView(BSModalLoginView):
    template_name = 'accounts/combo2.html'
    extra_context = dict(success_url=reverse_lazy('tabs:home'))
