from django.contrib.auth import login, logout
from django.urls import reverse_lazy
from django.views.generic import CreateView
from bootstrap_modal_forms.generic import BSModalCreateView
from accounts import forms

# Create your views here.
class SignUp(BSModalCreateView):
    template_name = "accounts/signup.html"
    form_class = forms.UserCreateForm
    success_message = 'Success: New user registered.'
    success_url = reverse_lazy("login")
