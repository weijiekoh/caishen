from django.urls import path

from . import views

handler500 = views.index
handler404 = views.index

urlpatterns = [
    path(r'', views.index, name='index'),
    path(r'give/', views.index, name='index'),
    path(r'redeem', views.index, name='index'),
    path(r'redeem', views.index, name='index'),
    path(r'redeem/manual', views.index, name='index'),
    path(r'about', views.index, name='index'),
    path(r'about/', views.index, name='index'),
]
