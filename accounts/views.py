from django.contrib.auth import login, logout
from django.urls import reverse_lazy
from bootstrap_modal_forms.generic import BSModalCreateView, BSModalLoginView
from .forms import CustomUserCreationForm, CustomAuthenticationForm

# Create your views here.
class SignUpView(BSModalCreateView):
    template_name = 'accounts/signup.html'
    form_class = CustomUserCreationForm
    success_message = 'Success: New user registered. Please log in.'
    success_url = reverse_lazy('login')

class CustomLoginView(BSModalLoginView):
    authentication_form = CustomAuthenticationForm
    template_name = 'accounts/login.html'
    success_message = 'Success: You are successfully logged in.'
    extra_context = dict(success_url=reverse_lazy('home'))
