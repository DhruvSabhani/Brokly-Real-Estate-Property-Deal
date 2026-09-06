from django.conf import settings
from django.urls import reverse
from django.db.models import Prefetch
from django.shortcuts import render, redirect, get_object_or_404
from accounts.utils import portal_required
from django.http import JsonResponse
from django.utils.translation import get_language, gettext as _
from accounts.models import CountryCode, State, City, PortalProfile
from accounts.views import get_states, get_cities
from propertys.models import (
    Property,
    PropertyType,
    PropertyPreferred,
    PropertyFacility,
    PropertyLocation,
    PropertyPhoto,
)
import json
from django.db import transaction

# Create your views here.


def portal_get_states(request):
    pro_country_id = request.GET.get("pro_country_id")
    statemodal = State.objects.filter(country_code=pro_country_id, is_active=True)
    state_data = [
        {
            "id": state.pk,
            "name": state.translated_state_name(),
            "latitude": state.latitude,
            "longitude": state.longitude,
        }
        for state in statemodal
    ]
    return JsonResponse({"states": state_data})


def portal_get_cities(request):
    pro_state_id = request.GET.get("pro_state_id")
    citymodal = City.objects.filter(state=pro_state_id, is_active=True)
    city_data = [
        {
            "id": city.pk,
            "name": city.translated_city_name(),
            "latitude": city.latitude,
            "longitude": city.longitude,
        }
        for city in citymodal
    ]
    return JsonResponse({"cities": city_data})


@portal_required
def portal_property_create(request):
    return render(
        request,
        "portal/propertys/property-create-edit/property-create-base.html",
        {
            "active": "portalPropertyCreate",
            "proQuickTips": [
                _("Fill in the required fields (*) accurately to continue"),
                _("Choose the correct property type and purpose"),
                _("Use a clear, searchable property name"),
                _("Enter the actual rent or selling price"),
                _("Add at least one valid phone number"),
                _("Write a short, accurate property description"),
            ],
            "proLocationQuickTips": [
                _("Search and select the correct location"),
                _("Add a nearby landmark for easy reference"),
                _("Pin the exact location on the map"),
                _("Double-check the pincode"),
            ],
            "proPhotosQuickTips": [
                _("Upload clear, bright and high-resolution photos"),
                _("Show every room and key areas"),
                _("Use natural lighting for best results"),
                _("First photo will be set as Cover Photo"),
                _("Drag photos to your desired position"),
                _("Max 10 photos allowed"),
            ],
            "proPublishQuickTips": [
                _("Basic Details"),
                _("Location"),
                _("Photos"),
            ],
        },
    )


@portal_required
def portal_property_store(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    profile_id = request.session.get("portal_profile")
    if not profile_id:
        return JsonResponse({"error": True, "message": _("Session expired")})
    try:
        with transaction.atomic():
            property_id = request.session.get("new_property_id")
            property_obj = None

            if property_id:
                property_obj = Property.objects.filter(
                    id=property_id, profile_id=profile_id
                ).first()

            if property_obj is None:
                property_obj = Property.objects.create(profile_id=profile_id)
                request.session["new_property_id"] = property_obj.pk

            protypeid = request.POST.get("protypeid")
            proname = request.POST.get("proname", "").strip()
            proprice = request.POST.get("proprice")
            propriceperiod = request.POST.get("propriceperiod")
            probhktype = request.POST.get("probhktype")
            propurpose = request.POST.get("propurpose")
            propreferredfor = request.POST.get("propreferredfor", "")
            profacilities = request.POST.get("profacilities", "")
            prodescription = request.POST.get("prodescription", "").strip()

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
            try:
                property_type_obj = PropertyType.objects.get(
                    id=protypeid, is_active=True
                )
            except PropertyType.DoesNotExist:
                return JsonResponse(
                    {
                        "error": True,
                        "message": _(
                            "Invalid or inactive property category selection."
                        ),
                    }
                )
            try:
                procontact = json.loads(request.POST.get("procontact", "[]"))
                if not isinstance(procontact, list):
                    raise ValueError
            except (json.JSONDecodeError, ValueError):
                return JsonResponse(
                    {"error": True, "message": _("Invalid phone number.")}
                )

            property_obj.type = property_type_obj
            property_obj.property_name = proname
            property_obj.property_price_period = propriceperiod
            property_obj.property_price = proprice
            property_obj.property_bhk_type = probhktype
            property_obj.property_purpose = propurpose
            property_obj.property_contact = procontact
            property_obj.property_description = prodescription
            property_obj.slug = property_obj.generate_property_slug()
            property_obj.save()
            # ManyToMany
            preferredfor_ids = []
            if propreferredfor:
                preferredfor_ids = [
                    int(value)
                    for value in propreferredfor.split(",")
                    if value.isdigit()
                ]
                property_obj.property_preferred.set(
                    PropertyPreferred.objects.filter(
                        id__in=preferredfor_ids, is_active=True
                    )
                )
            facilities_ids = []
            if profacilities:
                facilities_ids = [
                    int(value) for value in profacilities.split(",") if value.isdigit()
                ]
                property_obj.property_facilities.set(
                    PropertyFacility.objects.filter(
                        id__in=facilities_ids, is_active=True
                    )
                )
        return JsonResponse({"success": True, "stepcomplete": "complete"})
    except Exception as e:
        return JsonResponse(
            {"error": True, "message": _("Something went wrong. Please try again")}
        )


@portal_required
def portal_property_location_store(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    profile_id = request.session.get("portal_profile")
    property_id = request.session.get("new_property_id")
    if not profile_id or not property_id:
        return JsonResponse({"error": True, "message": _("Session expired")})
    try:
        with transaction.atomic():
            property_obj = get_object_or_404(
                Property, id=property_id, profile_id=profile_id
            )
            procountryid = request.POST.get("procountryid")
            prostateid = request.POST.get("prostateid")
            procityid = request.POST.get("procityid")
            proarea = request.POST.get("proarea", "").strip()
            prolandmark = request.POST.get("prolandmark", "").strip()
            propincode = request.POST.get("propincode", "").strip()
            proaddressline = request.POST.get("proaddressline", "").strip()
            prolatitude = request.POST.get("prolatitude")
            prolongitude = request.POST.get("prolongitude")

            if not procountryid:
                return JsonResponse(
                    {"error": True, "message": _("Please select a country.")}
                )
            if not prostateid:
                return JsonResponse(
                    {"error": True, "message": _("Please select a state.")}
                )
            if not procityid:
                return JsonResponse(
                    {"error": True, "message": _("Please select a city.")}
                )
            if not proarea:
                return JsonResponse(
                    {"error": True, "message": _("Please enter the locality or area.")}
                )
            if not propincode:
                return JsonResponse(
                    {"error": True, "message": _("Please enter the property pincode.")}
                )
            if not proaddressline:
                return JsonResponse(
                    {"error": True, "message": _("Please enter the property address.")}
                )
            country_obj = get_object_or_404(
                CountryCode, id=procountryid, is_active=True
            )
            state_obj = get_object_or_404(State, id=prostateid, is_active=True)
            city_obj = get_object_or_404(City, id=procityid, is_active=True)

            location_obj, created = PropertyLocation.objects.get_or_create(
                property=property_obj
            )

            location_obj.country = country_obj
            location_obj.state = state_obj
            location_obj.city = city_obj
            location_obj.area = proarea
            location_obj.landmark = prolandmark
            location_obj.pincode = propincode
            location_obj.address_line = proaddressline
            if prolatitude:
                location_obj.latitude = prolatitude
            if prolongitude:
                location_obj.longitude = prolongitude
            location_obj.save()

        return JsonResponse({"success": True, "stepcomplete": "complete"})
    except Exception as e:
        return JsonResponse({"error": True, "message": str(e)})


@portal_required
def portal_property_photo_store(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    profile_id = request.session.get("portal_profile")
    property_id = request.session.get("new_property_id")
    if not profile_id or not property_id:
        return JsonResponse({"error": True, "message": _("Session expired")})
    try:
        with transaction.atomic():
            property_obj = get_object_or_404(
                Property, id=property_id, profile_id=profile_id
            )
            prophotos = request.FILES.getlist("prophotos")
            prophototitles = request.POST.getlist("prophototitles")

            if len(prophotos) > 10:
                return JsonResponse(
                    {"error": True, "message": _("Maximum 10 photos are allowed.")}
                )
            if len(prophotos) != len(prophototitles):
                return JsonResponse(
                    {"error": True, "message": _("Photo data is invalid.")}
                )

            PropertyPhoto.objects.filter(property=property_obj).delete()

            for index, (file, title) in enumerate(
                zip(prophotos, prophototitles), start=1
            ):
                PropertyPhoto.objects.create(
                    property=property_obj,
                    image=file,
                    image_title=(title.strip() if title else ""),
                    is_primary=(index == 1),
                    display_order=index,
                )
        return JsonResponse({"success": True, "stepcomplete": "complete"})
    except Exception as e:
        return JsonResponse({"error": True, "message": str(e)})


@portal_required
def portal_property_create_review(request):
    if request.method != "GET":
        return JsonResponse({"error": True, "message": _("Invalid request.")})
    profile_id = request.session.get("portal_profile")
    property_id = request.session.get("new_property_id")
    if not profile_id or not property_id:
        return JsonResponse({"error": True, "message": _("Session expired.")})
    try:
        property_obj = get_object_or_404(
            Property.objects.select_related("type").prefetch_related(
                "property_preferred", "property_facilities"
            ),
            id=property_id,
            profile_id=profile_id,
        )
        location_obj = (
            PropertyLocation.objects.select_related("country", "state", "city")
            .filter(property=property_obj)
            .first()
        )
        photos = PropertyPhoto.objects.filter(property=property_obj).order_by(
            "display_order"
        )
        return JsonResponse(
            {
                "success": True,
                "property": {
                    "type": (
                        property_obj.type.translated_type_name()
                        if property_obj.type
                        else ""
                    ),
                    "name": (property_obj.property_name or ""),
                    "price": (property_obj.formatted_property_price() or ""),
                    "price_period": (
                        property_obj.get_property_price_period_display()
                        if property_obj.property_price_period
                        else ""
                    ),
                    "bhk_type": (
                        property_obj.get_property_bhk_type_display()
                        if property_obj.property_bhk_type
                        else ""
                    ),
                    "purpose": (
                        property_obj.get_property_purpose_display()
                        if property_obj.property_purpose
                        else ""
                    ),
                    "description": (property_obj.property_description or ""),
                    "contacts": (property_obj.property_contact or []),
                    "preferred_for": [
                        {"name": item.translated_preferred_name()}
                        for item in (property_obj.property_preferred.all())
                    ],
                    "facilities": [
                        {"name": item.translated_facilities_name()}
                        for item in (property_obj.property_facilities.all())
                    ],
                },
                "location": {
                    "full_address": (
                        location_obj.property_full_address() if location_obj else ""
                    ),
                },
                "photos": [
                    {
                        "url": photo.image.url if photo and photo.image else "",
                    }
                    for photo in photos
                    if photo.image
                ],
                "photo_count": photos.filter(image__isnull=False).count(),
            }
        )
    except Exception as e:
        return JsonResponse({"error": True, "message": str(e)})


@portal_required
def portal_property_create_disabled_list(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    profile_id = request.session.get("portal_profile")
    property_id = request.session.get("new_property_id")
    if not profile_id or not property_id:
        return JsonResponse({"error": True, "message": _("Session expired.")})
    try:
        request.session.pop("new_property_id", None)
        return JsonResponse(
            {
                "success": True,
                "redirect_url": reverse(portal_property_disabled_listings),
            }
        )
    except Exception as e:
        return JsonResponse({"error": True, "message": str(e)})


@portal_required
def portal_property_create_active_list(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    profile_id = request.session.get("portal_profile")
    property_id = request.session.get("new_property_id")
    if not profile_id or not property_id:
        return JsonResponse({"error": True, "message": _("Session expired.")})
    try:
        property_obj = get_object_or_404(
            Property, id=property_id, profile_id=profile_id
        )
        PropertyLocation.objects.filter(property=property_obj).update(is_active=True)
        PropertyPhoto.objects.filter(property=property_obj).update(is_active=True)

        property_obj.is_active = True
        property_obj.slug = property_obj.generate_property_slug()
        property_obj.save()

        request.session.pop("new_property_id", None)
        return JsonResponse(
            {
                "success": True,
                "stepcomplete": "complete",
                "redirect_url": reverse(portal_property_active_listings),
            }
        )
    except Exception as e:
        return JsonResponse(
            {"error": True, "message": _("Something went wrong. Please try again")}
        )
        # return JsonResponse({"error": True, "message": str(e)})


@portal_required
def portal_property_active_listings(request):
    profile_id = request.session.get("portal_profile")
    pro_active = (
        Property.objects.filter(profile=profile_id, is_active=True)
        .select_related("type")
        .prefetch_related(
            Prefetch(
                "photos",
                queryset=PropertyPhoto.objects.filter(is_active=True).order_by(
                    "display_order"
                ),
                to_attr="prefetched_photos",
            ),
        )
        .order_by("-create_at")
    )

    serialized_active_pro = []
    for pro in pro_active:
        pro_type = pro.type.translated_type_name() if pro.type else ""
        pro_name = pro.property_name
        pro_slug = pro.slug
        all_photos = list(getattr(pro, "prefetched_photos", []))
        first_photo = all_photos[0] if all_photos else None
        cover_photo_url = (
            first_photo.image.url
            if first_photo and first_photo.image
            else "/static/images/property-default-img.png"
        )
        photo_count = len([p for p in all_photos if p.image])
        pro_bhk_type = pro.get_property_bhk_type_display()
        pro_purpose = pro.get_property_purpose_display()
        pro_price = pro.formatted_property_price()
        pro_time_period = pro.get_property_price_period_display()
        pro_location = getattr(pro, "location", None)
        location_text = pro_location.property_full_address() if pro_location else ""

        serialized_active_pro.append(
            {
                "id": pro.pk,
                "slug": pro_slug,
                "cover_photo": cover_photo_url,
                "photo_count": photo_count,
                "type": pro_type,
                "name": pro_name,
                "bhk_type": pro_bhk_type,
                "purpose": pro_purpose,
                "price": pro_price,
                "time_period": pro_time_period,
                "location": location_text,
            }
        )

    return render(
        request,
        "portal/propertys/property-active-listings.html",
        {
            "active": "portalPropertyActiveListings",
            "serialized_active_pro": serialized_active_pro,
        },
    )


@portal_required
def portal_property_disabled_listings(request):
    profile_id = request.session.get("portal_profile")
    pro_disabled = (
        Property.objects.filter(profile=profile_id, is_active=False)
        .select_related("type")
        .prefetch_related(
            Prefetch(
                "photos",
                queryset=PropertyPhoto.objects.filter(is_active=False).order_by(
                    "display_order"
                ),
                to_attr="prefetched_photos",
            ),
        )
        .order_by("-create_at")
    )

    serialized_disabled_pro = []
    for pro in pro_disabled:
        pro_type = pro.type.translated_type_name() if pro.type else ""
        pro_name = pro.property_name
        pro_slug = pro.slug
        all_photos = list(getattr(pro, "prefetched_photos", []))
        first_photo = all_photos[0] if all_photos else None
        cover_photo_url = (
            first_photo.image.url
            if first_photo and first_photo.image
            else "/static/images/property-default-img.png"
        )
        photo_count = len([p for p in all_photos if p.image])
        pro_bhk_type = pro.get_property_bhk_type_display()
        pro_purpose = pro.get_property_purpose_display()
        pro_price = pro.formatted_property_price()
        pro_time_period = pro.get_property_price_period_display()
        pro_location = getattr(pro, "location", None)
        location_text = pro_location.property_full_address() if pro_location else ""

        serialized_disabled_pro.append(
            {
                "id": pro.pk,
                "slug": pro_slug,
                "cover_photo": cover_photo_url,
                "photo_count": photo_count,
                "type": pro_type,
                "name": pro_name,
                "bhk_type": pro_bhk_type,
                "purpose": pro_purpose,
                "price": pro_price,
                "time_period": pro_time_period,
                "location": location_text,
            }
        )

    return render(
        request,
        "portal/propertys/property-disabled-listings.html",
        {
            "active": "portalPropertyDisabledListings",
            "serialized_disabled_pro": serialized_disabled_pro,
        },
    )


@portal_required
def portal_property_active_listings_disabled(request, pro_id):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    profile_id = request.session.get("portal_profile")
    try:
        property_obj = Property.objects.select_related("type").get(
            profile=profile_id, id=pro_id
        )
        PropertyLocation.objects.filter(property=property_obj).update(is_active=False)
        PropertyPhoto.objects.filter(property=property_obj).update(is_active=False)
    except Property.DoesNotExist:
        return JsonResponse({"error": True, "error": "Property not found"})
    property_obj.is_active = False
    property_obj.save()

    return JsonResponse(
        {
            "success": True,
            "redirect_url": reverse(portal_property_disabled_listings),
        }
    )


@portal_required
def portal_property_disabled_listings_active(request, pro_id):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    profile_id = request.session.get("portal_profile")
    try:
        property_obj = Property.objects.select_related("type").get(
            profile=profile_id, id=pro_id
        )
        PropertyLocation.objects.filter(property=property_obj).update(is_active=True)
        PropertyPhoto.objects.filter(property=property_obj).update(is_active=True)
    except Property.DoesNotExist:
        return JsonResponse({"error": True, "error": "Property not found"})
    property_obj.is_active = True
    property_obj.save()

    return JsonResponse(
        {
            "success": True,
            "redirect_url": reverse(portal_property_active_listings),
        }
    )


@portal_required
def portal_property_active_disabled_listings_delete(request, pro_id):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    profile_id = request.session.get("portal_profile")
    try:
        property_obj = (
            Property.objects.select_related("type")
            .get(profile=profile_id, id=pro_id)
            .delete()
        )
        PropertyLocation.objects.filter(property=property_obj).delete()
        PropertyPhoto.objects.filter(property=property_obj).delete()
    except Property.DoesNotExist:
        return JsonResponse({"error": True, "error": "Property not found"})

    return JsonResponse(
        {
            "success": True,
        }
    )
