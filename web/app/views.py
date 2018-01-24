from django.shortcuts import render
from django.http import HttpResponse

from project import settings

# Create your views here.

def index(request):
    return render(request, "app/index.html", {"DEBUG": settings.DEBUG})
