"""
URL configuration for tutorbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path0
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from aigeneratorapp.views import front
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', front, name='front'),
    path('api/aigenerator/', include('aigeneratorapp.urls')),
    path('api/qa/', include('qaapp.urls')),
    path('manifest.json', serve, kwargs={'path': 'manifest.json', 'document_root': settings.STATIC_ROOT}),
    path('logo192.png', serve, kwargs={'path': 'logo192.png', 'document_root': settings.STATIC_ROOT}),
    path('1.jpg', serve, kwargs={'path': '1.jpg','document_root': settings.STATIC_ROOT }),
    path('favicon.ico', serve, kwargs={'path': 'favicon.ico','document_root': settings.STATIC_ROOT })
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)