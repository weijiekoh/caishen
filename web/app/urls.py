from django.urls import path

from . import views

urlpatterns = [
    path(r'', views.index, name='index'),
    path(r'deposit/', views.index, name='index'),
    path(r'redeem', views.index, name='index'),
    path(r'about', views.index, name='index'),
]
