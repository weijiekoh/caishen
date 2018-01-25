from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

from project import settings

# Create your views here.

@login_required
def index(request):
    return render(request, "app/index.html", {"DEBUG": settings.DEBUG})
