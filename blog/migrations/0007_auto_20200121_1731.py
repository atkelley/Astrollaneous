# Generated by Django 2.2.5 on 2020-01-21 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0006_auto_20200107_1331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='image_url',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]