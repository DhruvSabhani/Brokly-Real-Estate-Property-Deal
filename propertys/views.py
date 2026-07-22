from django.conf import settings
from django.shortcuts import render, redirect
from accounts.utils import portal_required

# Create your views here.


@portal_required
def portal_property_create(request):
    return render(
        request,
        "portal/propertys/property_create.html",
        {
            "active": "portal-property-create",
        },
    )

