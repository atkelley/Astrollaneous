# Generated by Django 3.0.6 on 2021-01-21 19:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='satellite',
            old_name='name',
            new_name='acronym',
        ),
    ]