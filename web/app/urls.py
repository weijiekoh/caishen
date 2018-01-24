from django.urls import path

from . import views

urlpatterns = [
    path(r'', views.index, name='index'),
    path(r'home/', views.index, name='index'),
]
