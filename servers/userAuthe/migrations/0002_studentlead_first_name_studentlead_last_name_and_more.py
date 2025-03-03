# Generated by Django 5.1.5 on 2025-02-03 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userAuthe', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentlead',
            name='first_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='studentlead',
            name='last_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='supervisor',
            name='first_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='supervisor',
            name='last_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='title',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
