from django.core.cache import cache
from accounts.models import Language, CountryCode, State, City
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
        "uDefaultAddress": getattr(request, "uDefaultAddress", None),
        "uAddressList": getattr(request, "uAddressList", None),
        "countries": CountryCode.objects.filter(is_active=True),
    }


def portal_context(request):
    profile_id = request.session.get("portal_profile")
    if not hasattr(request, "portal_obj"):
        return {}

    return {
        "languages": Language.objects.filter(is_active=True),
        "pLanguage": Language.objects.filter(
            is_active=True, code=request.LANGUAGE_CODE
        ).first(),
        "portal": getattr(request, "portal_obj", None),
        "pProfile": getattr(request, "pProfile", None),
        "pDefaultAddress": getattr(request, "pDefaultAddress", None),
        "pAddressList": getattr(request, "pAddressList", None),
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
