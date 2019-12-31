from django import forms

class MarsForm(forms.Form):
    earth_date = forms.DateField(widget=forms.TextInput(attrs={'class':'datepicker'}))
