from django.urls import path

from . import views

urlpatterns = [
    path(r'', views.index, name='index'),
    path(r'give/', views.index, name='index'),
    path(r'redeem', views.index, name='index'),
    path(r'redeem', views.index, name='index'),
    path(r'redeem/manual', views.index, name='index'),
    path(r'about', views.index, name='index'),
]
