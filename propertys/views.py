from django.conf import settings
from django.shortcuts import render, redirect
from accounts.utils import portal_required
from propertys.models import *
from accounts.models import *

# Create your views here.


@portal_required
def portal_property_create(request):
    country_code = CountryCode.objects.filter(is_active=True)

    property_types = PropertyTypes.objects.filter(is_active=True)
    property_perferred = PropertyPerferred.objects.filter(is_active=True)
    property_facilities = PropertyFacilities.objects.filter(is_active=True)
    context = {
        "portal": request.user_obj,
        "pProfile": request.pProfile,
        "pAddress": request.pAddress,
        "active": "portal-property-create",
        "country_code": country_code,
        "property_types": property_types,
        "property_perferred": property_perferred,
        "property_facilities": property_facilities,
    }
    return render(request, "portal/propertys/property_create.html", context)
