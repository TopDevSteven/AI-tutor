from django.urls import path
from . import views

urlpatterns = [
    path("upload/", views.upload),
    path("query/", views.chat_with_doc),
    path("records/", views.records),
]