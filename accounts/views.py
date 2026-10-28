from urllib import request
from django.conf import settings
from django.shortcuts import render, redirect
from propertys.services import user_property_listings
from accounts.models import *
from common.models import *
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from django.utils import timezone, translation
from django.utils.translation import get_language, gettext as _
from django.views.decorators.http import require_POST
from accounts.utils import user_required, portal_required


def change_panel_language(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})

    language = request.POST.get("language", "").strip()
    panel = request.POST.get("panel", "").strip()

    allowed_languages = [code for code, name in settings.LANGUAGES]

    if language not in allowed_languages:
        return JsonResponse(
            {
                "error": True,
                "message": _("Invalid language"),
            }
        )

    if panel == "user":
        request.session["user_language"] = language
    elif panel == "portal":
        request.session["portal_language"] = language
    else:
        return JsonResponse(
            {
                "error": True,
                "message": _("Invalid panel"),
            }
        )
    request.session.modified = True
    translation.activate(language)
    request.LANGUAGE_CODE = language
    response = JsonResponse(
        {
            "success": True,
            "message": _("Language changed successfully"),
            "language": language,
            "panel": panel,
        }
    )
    return response


def get_states(request):
    country_id = request.GET.get("country_id")
    statemodal = State.objects.filter(country_code=country_id, is_active=True)
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


def get_cities(request):
    state_id = request.GET.get("state_id")
    citymodal = City.objects.filter(state=state_id, is_active=True)
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


def generate_otp(phone):
    otp_obj = OTP.objects.create(phone=phone)
    print(f"OTP for {phone} : {otp_obj._raw_otp}")
    return otp_obj._raw_otp


@ensure_csrf_cookie
def login_with_otp(request, role):
    if role == "user" and request.session.get("user_login"):
        return redirect("/home/")
    if role == "portal" and request.session.get("portal_login"):
        return redirect("/portal/dashboard/")
    if role == "admin" and request.session.get("admin_login"):
        return redirect("/admin/")

    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"error": True, "message": _("Invalid request")})

        code = data.get("code")
        phone = data.get("phone")
        otp = data.get("otp")

        request.session["role"] = role
        request.session["phone"] = phone
        request.session["code"] = code

        user = CustomUser.objects.filter(phone=phone).first()

        if role == "admin":
            if not user:
                return JsonResponse({"error": True, "message": _("Admin not found")})
            if not (user.is_superuser and user.is_staff):
                return JsonResponse({"error": True, "message": _("Not admin accounts")})
        else:
            if user and user.is_superuser:
                return JsonResponse(
                    {"error": True, "message": _("Admin accounts cannot login here")}
                )

        if not otp:
            otp = generate_otp(phone)

        return JsonResponse({"success": True, "message": otp, "step": "otp"})

    languages = Language.objects.filter(is_active=True).all()
    countrycode = CountryCode.objects.filter(is_active=True).all()
    statemodal = State.objects.filter(country_code=1, is_active=True).all()

    context = {
        "languages": languages,
        "countrycode": countrycode,
        "statemodal": statemodal,
    }

    template = {
        "user": "accounts/user_login.html",
        "portal": "accounts/portal_login.html",
        "admin": "accounts/admin_login.html",
    }

    return render(request, template[role], context)


def resend_otp(request):
    phone = request.session.get("phone")
    if not phone:
        return JsonResponse({"error": True, "message": _("Session expired")})
    otp = generate_otp(phone)
    return JsonResponse({"success": True, "message": otp})


def verify_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": True, "message": _("Invalid JSON")})
    otp = data.get("otp")

    code = request.session.get("code")
    phone = request.session.get("phone")
    role = request.session.get("role")

    try:
        code_id = CountryCode.objects.filter(id=int(code)).first() if code else None
    except (TypeError, ValueError):
        code_id = None

    if not phone or not role or not code_id:
        return JsonResponse({"error": True, "message": _("Session expired")})

    full_phone = f"{code_id.country_code}{phone}"
    otp_record = (
        OTP.objects.filter(phone=phone, is_used=False).order_by("-created_at").first()
    )
    if not otp_record:
        return JsonResponse({"error": True, "message": _("No OTP found")})
    if not otp_record.check_otp_hash(otp):
        return JsonResponse({"error": True, "message": _("Invalid OTP")})
    if otp_record.is_expired:
        return JsonResponse({"error": True, "message": _("OTP expired")})
    otp_record.is_used = True
    otp_record.save()

    user, created = CustomUser.objects.get_or_create(
        full_phone=full_phone,
        defaults={"phone": phone, "country_code": code_id},
    )

    user.last_login = timezone.now()
    user.is_active = True
    country = code_id or CountryCode.objects.filter(id=1).first()
    profile_data = {}

    # admin login
    if role == "admin":
        if not user.is_superuser:
            return JsonResponse({"error": True, "message": _("Not admin accouuts")})
        request.session["admin_login"] = user.pk

    # portal login
    elif role == "portal":
        if user.is_superuser:
            return JsonResponse(
                {"error": True, "message": _("Admin canton login portal")}
            )
        user.is_portal = True
        request.session["portal_login"] = user.pk

        pProfile, created = PortalProfile.objects.get_or_create(user=user)
        request.session["portal_profile"] = pProfile.pk

        address_queryset = ProfileAddresses.objects.filter(
            profile_role=role, profile_id=pProfile.pk, is_active=True
        )

        pAddress = address_queryset.filter(is_default=True).first()

        if not pAddress:
            pAddress = address_queryset.first()
            if pAddress:
                pAddress.is_default = True
                pAddress.save()
            else:
                pAddress = ProfileAddresses.objects.create(
                    profile_role=role,
                    profile_id=pProfile.pk,
                    country=country,
                    is_default=True,
                    is_active=True,
                )

        profile_data = {
            "img": None,
            "name": None,
            "state_id": None,
            "state_name": None,
            "city_id": None,
            "city_name": None,
        }

        if pProfile.img or pProfile.name or pAddress.state:
            profile_data = {
                "img": pProfile.img.url if pProfile.img else None,
                "name": pProfile.name.title() if pProfile.name else None,
                "state_id": pAddress.state.pk if pAddress.state else None,
                "state_name": (
                    pAddress.state.translated_state_name() if pAddress.state else None
                ),
                "city_id": pAddress.city.pk if pAddress.city else None,
                "city_name": (
                    pAddress.city.translated_city_name() if pAddress.city else None
                ),
            }

    # user login
    elif role == "user":
        if user.is_superuser:
            return JsonResponse(
                {"error": True, "message": _("Admin canton login as a regular user")}
            )
        user.is_user = True
        request.session["user_login"] = user.pk

        uProfile, created = UserProfile.objects.get_or_create(user=user)
        request.session["user_profile"] = uProfile.pk

        address_queryset = ProfileAddresses.objects.filter(
            profile_role=role, profile_id=uProfile.pk, is_active=True
        )

        uAddress = address_queryset.filter(is_default=True).first()

        if not uAddress:
            uAddress = address_queryset.first()
            if uAddress:
                uAddress.is_default = True
                uAddress.save()
            else:
                uAddress = ProfileAddresses.objects.create(
                    profile_role=role,
                    profile_id=uProfile.pk,
                    country=country,
                    is_default=True,
                    is_active=True,
                )

        profile_data = {
            "img": None,
            "name": None,
            "state_id": None,
            "state_name": None,
            "city_id": None,
            "city_name": None,
        }

        if uProfile.img or uProfile.name or uAddress.state:
            profile_data = {
                "img": uProfile.img.url if uProfile.img else None,
                "name": uProfile.name.title() if uProfile.name else None,
                "state_id": uAddress.state.pk if uAddress.state else None,
                "state_name": (
                    uAddress.state.translated_state_name() if uAddress.state else None
                ),
                "city_id": uAddress.city.pk if uAddress.city else None,
                "city_name": (
                    uAddress.city.translated_city_name() if uAddress.city else None
                ),
            }

    else:
        return JsonResponse({"error": True, "message": _("Invalid role")})

    user.country_code = country
    user.save()

    request.session.pop("role", None)
    request.session.pop("code", None)
    request.session.pop("phone", None)

    return JsonResponse({"success": True, "step": "profile", "profile": profile_data})


def user_profile(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": _("Invalid request")})

    user_id = request.session.get("user_login")
    if not user_id:
        return JsonResponse({"error": True, "message": _("Session expired")})

    user = CustomUser.objects.filter(id=user_id).first()

    if not user:
        return JsonResponse({"error": True, "message": _("User not found")})

    uProfile, created = UserProfile.objects.get_or_create(user=user)
    address_queryset = ProfileAddresses.objects.filter(
        profile_role="user", profile_id=uProfile.pk
    )
    uAddress = address_queryset.filter(is_active=True).first()
    if not uAddress:
        uAddress = address_queryset.first()
    if not uAddress:
        uAddress = ProfileAddresses.objects.create(
            profile_role="user", profile_id=uProfile.pk, is_active=True, is_default=True
        )

    utheme = request.POST.get("utheme")
    ulang = request.POST.get("ulang")
    uimg = request.FILES.get("uimg")
    uname = request.POST.get("uname")
    ustateid = request.POST.get("ustateid")
    ucityid = request.POST.get("ucityid")

    if utheme and utheme != "null":
        uProfile.theme = Theme.objects.filter(id=utheme).first()
    else:
        uProfile.theme = Theme.objects.filter(id=1).first()

    if ulang and ulang != "null":
        uProfile.language = Language.objects.filter(id=ulang).first()
    else:
        uProfile.language = Language.objects.filter(id=1).first()

    if uimg:
        uProfile.img = uimg

    if uname:
        uProfile.name = uname
    uProfile.save()

    if ustateid:
        state = State.objects.filter(id=ustateid).first()
        if state:
            uAddress.state = state

    if ucityid:
        city = City.objects.filter(id=ucityid).first()
        if city:
            uAddress.city = city

    address_queryset.exclude(id=uAddress.pk).update(is_active=True, is_default=False)

    uAddress.is_default = True
    uAddress.is_active = True
    uAddress.save()

    return JsonResponse(
        {
            "success": True,
            "message": _("Profile updated successfully"),
        }
    )


def portal_profile(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})

    portal_id = request.session.get("portal_login")
    if not portal_id:
        return JsonResponse({"error": True, "message": _("Session expired")})

    portal = CustomUser.objects.filter(id=portal_id).first()

    if not portal:
        return JsonResponse({"error": True, "message": _("Portal not found")})

    pProfile, created = PortalProfile.objects.get_or_create(user=portal)
    address_queryset = ProfileAddresses.objects.filter(
        profile_role="portal", profile_id=pProfile.pk
    )
    pAddress = address_queryset.filter(is_active=True).first()
    if not pAddress:
        pAddress = address_queryset.first()
    if not pAddress:
        pAddress = ProfileAddresses.objects.create(
            profile_role="portal",
            profile_id=pProfile.pk,
            is_active=True,
            is_default=True,
        )

    ptheme = request.POST.get("ptheme")
    plang = request.POST.get("plang")
    pimg = request.FILES.get("pimg")
    pname = request.POST.get("pname")
    pstateid = request.POST.get("pstateid")
    pcityid = request.POST.get("pcityid")

    if ptheme and ptheme != "null":
        pProfile.theme = Theme.objects.filter(id=ptheme).first()
    else:
        pProfile.theme = Theme.objects.filter(id=1).first()

    if plang and plang != "null":
        pProfile.language = Language.objects.filter(id=plang).first()
    else:
        pProfile.language = Language.objects.filter(id=1).first()

    if pimg:
        pProfile.img = pimg

    if pname:
        pProfile.name = pname
    pProfile.save()

    if pstateid:
        state = State.objects.filter(id=pstateid).first()
        if state:
            pAddress.state = state

    if pcityid:
        city = City.objects.filter(id=pcityid).first()
        if city:
            pAddress.city = city

    address_queryset.exclude(id=pAddress.pk).update(is_active=True, is_default=False)

    pAddress.is_default = True
    pAddress.is_active = True
    pAddress.save()

    return JsonResponse(
        {
            "success": True,
            "message": _("Profile updated successfully"),
        }
    )


def login_user(request):
    return login_with_otp(request, "user")


def login_portal(request):
    request.session.pop("new_property_id", None)
    return login_with_otp(request, "portal")


@user_required
def user_dashboard(request):
    return render(
        request,
        "user/dashboard.html",
        {
            "active": "home",
            "properties": user_property_listings(),
        },
    )


@user_required
def user_near_me(request):
    return render(
        request,
        "user/near_me.html",
        {
            "active": "userNearMe",
        },
    )


@user_required
def user_shortlisted(request):
    return render(
        request,
        "user/messages.html",
        {
            "active": "userShortlisted",
        },
    )


@user_required
def user_messages(request):
    return render(
        request,
        "user/messages.html",
        {
            "active": "userMessages",
        },
    )


@user_required
def user_help(request):
    return render(
        request,
        "user/help.html",
        {
            "active": "userHelp",
        },
    )


@user_required
def user_settings(request):
    return render(
        request,
        "user/settings.html",
        {
            "active": "userSettings",
        },
    )


@user_required
@require_POST
def user_profile_update(request):
    profile_id = request.session.get("user_profile")

    uProfile = UserProfile.objects.filter(id=profile_id).first()

    if not uProfile:
        return JsonResponse({"success": False, "message": _("User profile not found")})

    uploaded_avatar = request.FILES.get("uEditAvatarInput")
    full_name = request.POST.get("uEditNameInput", "").strip()

    if len(full_name) > 20:
        return JsonResponse(
            {"success": False, "message": _("Full name must be 20 characters or less")}
        )

    if uploaded_avatar:
        if uploaded_avatar.size > 2 * 1024 * 1024:
            return JsonResponse(
                {
                    "success": False,
                    "message": _("Uploaded avatar image size must be less than (2MB)"),
                }
            )

        if uProfile.img and uProfile.img.name != "static/images/avatar.png":
            try:
                if os.path.isfile(uProfile.img.path):
                    os.remove(uProfile.img.path)
            except (ValueError, OSError):
                pass

        uProfile.img = uploaded_avatar
    uProfile.name = full_name
    uProfile.save()
    return JsonResponse(
        {
            "success": True,
            "message": _("Profile updated successfully"),
        }
    )


@portal_required
def portal_dashboard(request):
    return render(
        request,
        "portal/dashboard.html",
        {
            "active": "portalDashboard",
        },
    )


@portal_required
def portal_help(request):
    return render(
        request,
        "portal/help.html",
        {
            "active": "portalHelp",
        },
    )


@portal_required
def portal_settings(request):
    return render(
        request,
        "portal/settings.html",
        {
            "active": "portalSettings",
        },
    )


@portal_required
@require_POST
def portal_profile_update(request):
    profile_id = request.session.get("portal_profile")

    pProfile = PortalProfile.objects.filter(id=profile_id).first()

    if not pProfile:
        return JsonResponse({"success": False, "message": _("User profile not found")})

    uploaded_avatar = request.FILES.get("pEditAvatarInput")
    full_name = request.POST.get("pEditNameInput", "").strip()

    if len(full_name) > 20:
        return JsonResponse(
            {"success": False, "message": _("Full name must be 20 characters or less")}
        )

    if uploaded_avatar:
        if uploaded_avatar.size > 2 * 1024 * 1024:
            return JsonResponse(
                {
                    "success": False,
                    "message": _("Uploaded avatar image size must be less than (2MB)"),
                }
            )

        if pProfile.img and pProfile.img.name != "static/images/avatar.png":
            try:
                if os.path.isfile(pProfile.img.path):
                    os.remove(pProfile.img.path)
            except (ValueError, OSError):
                pass

        pProfile.img = uploaded_avatar
    pProfile.name = full_name
    pProfile.save()
    return JsonResponse(
        {
            "success": True,
            "message": _("Profile updated successfully"),
        }
    )


def user_logout(request):
    request.session.pop("user_login", None)
    # request.session.pop("code", None)
    # request.session.pop("phone", None)
    return redirect("/login/")


def portal_logout(request):
    request.session.pop("new_property_id", None)
    request.session.pop("portal_login", None)
    # request.session.pop("code", None)
    # request.session.pop("phone", None)
    return redirect("/portal/login/")
