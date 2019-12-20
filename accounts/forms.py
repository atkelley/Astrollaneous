from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from bootstrap_modal_forms.forms import BSModalForm


class UserCreateForm(UserCreationForm, BSModalForm):
    class Meta:
        fields = ("username", "email", "password1", "password2")
        model = get_user_model()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].label = "Display name"
        self.fields["email"].label = "Email address"
