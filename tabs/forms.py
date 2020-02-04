from django import forms

class MarsForm(forms.Form):
    earth_date = forms.DateField(widget=forms.TextInput(attrs={'class':'datepicker'}))
    sol_date = forms.IntegerField(min_value=0)
    camera = forms.CharField(max_length=10, required=False)

class NasaForm(forms.Form):
    query_term = forms.CharField(label='query_term', max_length=255)
