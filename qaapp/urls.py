from django.contrib import admin
from django.urls import path
from aigeneratorapp.views import front
from . import views

urlpatterns = [
    path("upload/", views.upload),
]