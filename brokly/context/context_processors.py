from django.core.cache import cache
from accounts.models import Language, CountryCode
from propertys.models import (
    PropertyType,
    PropertyPreferred,
    PropertyFacility,
    Property,
    PropertyPhoto,
)


def user_context(request):
    if not hasattr(request, "user_obj"):
        return {}
    return {
        "user": getattr(request, "user_obj", None),
        "uProfile": getattr(request, "uProfile", None),
        "uAddress": getattr(request, "uAddress", None),
    }


def portal_context(request):
    profile_id = request.session.get("portal_profile")
    if not hasattr(request, "portal_obj"):
        return {}

    return {
        "languages": Language.objects.filter(is_active=True),
        "portal": getattr(request, "portal_obj", None),
        "pProfile": getattr(request, "pProfile", None),
        "pAddress": getattr(request, "pAddress", None),
        "country_code": CountryCode.objects.filter(is_active=True),
        "property_types": PropertyType.objects.filter(is_active=True),
        "property_preferred": PropertyPreferred.objects.filter(is_active=True),
        "property_facilities": PropertyFacility.objects.filter(is_active=True),
        "count_property": Property.objects.filter(profile=profile_id).count(),
        "active_property": Property.objects.filter(
            profile=profile_id, is_active=True
        ).count(),
        "disabled_property": Property.objects.filter(
            profile=profile_id, is_active=False
        ).count(),
    }
