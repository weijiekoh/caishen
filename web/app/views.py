from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

from project import settings

# Create your views here.

# @login_required
def index(request):
    lang = request.META.get('LANGUAGE', request.META.get('LANG'))

    if lang is None:
        lang = "en"
    elif lang == "zh":
        pass
    elif ":" in lang:
        try:
            lang = lang.split(":")[1]
        except:
            lang = "en"

    return render(
            request,
            "app/index.html",
            {"DEBUG": settings.DEBUG, "LANG": lang}
    )
