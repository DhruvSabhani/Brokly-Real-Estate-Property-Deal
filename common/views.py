from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from django.urls import reverse
from django.db.models import Prefetch
from accounts.utils import user_required, portal_required
from django.http import JsonResponse
from django.utils.translation import get_language, gettext as _
from common.models import ProfileAddresses
from accounts.models import UserProfile, PortalProfile
import json
from django.db import transaction
from django.views.decorators.http import require_POST, require_GET

# Create your views here.


@require_POST
def add_profile_address(request):
    profile_role = request.session.get("profile_role", "user")

    if profile_role == "portal":
        profile_id = request.session.get("portal_profile")
        redirect = reverse("accounts:portal_dashboard")
    else:
        profile_id = request.session.get("user_profile")
        redirect = reverse("accounts:user_dashboard")

    if not profile_id:
        return JsonResponse(
            {"success": False, "message": _("Session invalid or expired.")}
        )

    latitude = request.POST.get("latitude") or None
    longitude = request.POST.get("longitude") or None
    country_id = request.POST.get("country")
    state_id = request.POST.get("state")
    city_id = request.POST.get("city")
    area = request.POST.get("area", "").strip()
    pincode = request.POST.get("pincode", "").strip()

    try:
        with transaction.atomic():
            ProfileAddresses.objects.filter(
                profile_id=profile_id, profile_role=profile_role, is_default=True
            ).update(is_default=False)
            ProfileAddresses.objects.create(
                profile_id=profile_id,
                profile_role=profile_role,
                country_id=country_id,
                state_id=state_id,
                city_id=city_id,
                area=area,
                pincode=pincode,
                latitude=latitude,
                longitude=longitude,
                is_default=True,
                is_active=True,
            )
            return JsonResponse(
                {
                    "success": True,
                    "redirect": redirect,
                }
            )
    except Exception:
        return JsonResponse(
            {"success": False, "message": _("Database communication error occurred.")}
        )


@require_POST
def default_address_select(request, address_id):
    profile_role = request.session.get("profile_role", "user")

    if profile_role == "portal":
        profile_id = request.session.get("portal_profile")
        redirect = reverse("accounts:portal_dashboard")
    else:
        profile_id = request.session.get("user_profile")
        redirect = reverse("accounts:user_dashboard")

    if not profile_id:
        return JsonResponse(
            {"success": False, "message": _("Session invalid or expired.")}
        )
    try:
        with transaction.atomic():
            ProfileAddresses.objects.filter(
                profile_id=profile_id, profile_role=profile_role
            ).exclude(id=address_id).update(is_default=False)

            ProfileAddresses.objects.filter(
                id=address_id, profile_id=profile_id, profile_role=profile_role
            ).update(is_default=True)

            return JsonResponse(
                {
                    "success": True,
                    "redirect": redirect,
                }
            )
    except Exception:
        return JsonResponse(
            {"success": False, "message": _("Database communication error occurred.")}
        )


@require_GET
def profile_address_edit(request, address_id):
    profile_role = request.session.get("profile_role", "user")

    if profile_role == "portal":
        profile_id = request.session.get("portal_profile")
    else:
        profile_id = request.session.get("user_profile")

    if not profile_id:
        return JsonResponse(
            {"success": False, "message": _("Session invalid or expired.")}
        )
    try:
        address_obj = ProfileAddresses.objects.filter(
            pk=address_id, profile_role=profile_role, profile_id=profile_id
        ).first()

        if address_obj is None:
            return JsonResponse({"success": False, "message": _("Address not found")})

        return JsonResponse(
            {
                "success": True,
                "address": {
                    "latitude": address_obj.latitude,
                    "longitude": address_obj.longitude,
                    "country_id": address_obj.country.pk if address_obj.country else "",
                    "state_id": address_obj.state.pk if address_obj.state else "",
                    "city_id": address_obj.city.pk if address_obj.city else "",
                    "area": address_obj.area,
                    "pincode": address_obj.pincode,
                },
            }
        )
    except Exception:
        return JsonResponse(
            {"success": False, "message": _("Database communication error occurred.")}
        )


@require_POST
def profile_address_delete(request, address_id):
    profile_role = request.session.get("profile_role", "user")

    if profile_role == "portal":
        profile_id = request.session.get("portal_profile")
        redirect = reverse("accounts:portal_dashboard")
    else:
        profile_id = request.session.get("user_profile")
        redirect = reverse("accounts:user_dashboard")

    if not profile_id:
        return JsonResponse(
            {"success": False, "message": _("Session invalid or expired.")}
        )

    address_obj = ProfileAddresses.objects.filter(
        pk=address_id, profile_role=profile_role, profile_id=profile_id
    ).first()

    if not address_obj:
        return JsonResponse({"success": False, "message": _("Address not found")})

    try:
        with transaction.atomic():
            address_obj.delete()
        return JsonResponse(
            {
                "success": True,
                "redirect": redirect,
            }
        )

    except Exception:
        return JsonResponse(
            {"success": False, "message": _("Database communication error occurred.")}
        )
