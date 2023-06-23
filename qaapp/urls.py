from django.contrib import admin
from django.urls import path
from aigeneratorapp.views import front
from . import views

urlpatterns = [
    path("upload/", views.upload),
    path("query/", views.chat_with_doc),
    path("records/", views.records),
]