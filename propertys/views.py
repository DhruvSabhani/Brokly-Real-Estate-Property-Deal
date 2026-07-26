from django.conf import settings
from django.shortcuts import render, redirect
from accounts.utils import portal_required
from django.http import JsonResponse
from django.utils.translation import gettext as _
from accounts.models import PortalProfile
from propertys.models import Property
import json
from django.db import transaction

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


@portal_required
def portal_property_store(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})

    pProfileId = request.session.get("portal_profile")
    if not pProfileId:
        return JsonResponse({"error": True, "message": _("Session expired")})

    try:
        with transaction.atomic():
            protypeid = request.POST.get("protypeid")
            proname = request.POST.get("proname", "").strip()
            proprice = request.POST.get("proprice")
            propriceperiod = request.POST.get("propriceperiod")
            probhktype = request.POST.get("probhktype")
            propurpose = request.POST.get("propurpose")
            propreferredfor = request.POST.get("propreferredfor", "")
            profacilities = request.POST.get("profacilities", "")
            prodescription = request.POST.get("prodescription", "")

            try:
                procontact = json.loads(request.POST.get("procontact", "[]"))
            except json.JSONDecodeError:
                return JsonResponse(
                    {"error": True, "message": _("Invalid phone number.")}
                )

            if not protypeid:
                return JsonResponse(
                    {"error": True, "message": _("Please select a property type.")}
                )

            if not proname:
                return JsonResponse(
                    {"error": True, "message": _("Please enter a property name.")}
                )

            if not proprice:
                return JsonResponse(
                    {
                        "error": True,
                        "message": _(
                            "Please enter a valid property price and select a price period."
                        ),
                    }
                )

            property_obj = Property(
                profile_id=pProfileId,
                type=protypeid,
                property_name=proname,
                property_price_period=propriceperiod,
                property_price=proprice,
                property_bhk_type=probhktype,
                property_purpose=propurpose,
                property_contact=procontact,
                property_description=prodescription,
            )

            property_obj.save()

            # ManyToMany
            if propreferredfor:
                preferredfor_ids = [int(i) for i in propreferredfor.split(",") if i]
                property_obj.property_preferred.set(preferredfor_ids)

            if profacilities:
                facilities_ids = [int(i) for i in profacilities.split(",") if i]
                property_obj.property_facilities.set(facilities_ids)

        return JsonResponse({"success": True, "message": "successfully add"})
    except Exception as e:
        return JsonResponse(
            {"error": True, "message": _("Something went wrong. Please try again")}
        )


@portal_required
def portal_property_list(request):
    return render(
        request,
        "portal/propertys/property_list.html",
        {
            "active": "portal-property-list",
        },
    )
