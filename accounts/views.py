from urllib import request
from django.conf import settings
from django.shortcuts import render, redirect
from accounts.models import *
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from django.utils import timezone
from django.utils.translation import get_language, gettext as _


def change_panel_language(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": _("Invalid request")})

    language = request.POST.get("language")
    panel = request.POST.get("panel")

    allowed_languages = [code for code, name in settings.LANGUAGES]

    if language not in allowed_languages:
        return JsonResponse({"error": True, "message": _("Invalid language")})

    if panel == "user":
        request.session["user_language"] = language
    elif panel == "broker":
        request.session["broker_language"] = language
    else:
        return JsonResponse(
            {
                "error": True,
                "message": _("Invalid panel"),
            }
        )
    return JsonResponse(
        {
            "success": True,
            "message": _("Language changed successfully"),
            "language": language,
            "panel": panel,
        }
    )


def get_states(request):
    country_id = request.GET.get("country_id")
    statemodal = State.objects.filter(country_code=country_id, is_active=True).values(
        "id", "name"
    )
    return JsonResponse({"states": list(statemodal)})


def get_cities(request):
    state_id = request.GET.get("state_id")
    citymodal = City.objects.filter(state=state_id, is_active=True).values("id", "name")
    return JsonResponse({"cities": list(citymodal)})


def generate_otp(phone):
    otp_obj = OTP.objects.create(phone=phone)
    print(f"OTP for {phone} : {otp_obj._raw_otp}")
    return otp_obj._raw_otp


@ensure_csrf_cookie
def login_with_otp(request, role):
    if role == "user" and request.session.get("user_login"):
        return redirect("/")
    if role == "broker" and request.session.get("broker_login"):
        return redirect("/broker/")

    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"error": True, "message": _("Invalid request")})
        code = data.get("code")
        phone = data.get("phone")
        otp = data.get("otp")
        request.session["role"] = role

        admin_user = CustomUser.objects.filter(
            phone=phone, is_superuser=True, is_staff=True
        ).exists()
        if admin_user:
            return JsonResponse({"error": True, "message": _("Not valid number")})

        request.session["code"] = code
        request.session["phone"] = phone
        if not otp:
            otp = generate_otp(phone)

        return JsonResponse({"success": True, "message": otp, "step": "otp"})

    languages = Language.objects.filter(is_active=True).all()
    countrycode = CountryCode.objects.filter(is_active=True).all()
    statemodal = State.objects.filter(country_code=1, is_active=True).all()

    context = {
        "languages": languages,
        # "current_language": get_language(),
        "countrycode": countrycode,
        "statemodal": statemodal,
    }

    return render(
        request,
        "accounts/user_login.html" if role == "user" else "accounts/broker_login.html",
        context,
    )


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
    code = request.session.get("code")
    phone = request.session.get("phone")
    otp = data.get("otp")
    role = request.session.get("role")
    if not phone or not role:
        return JsonResponse({"error": True, "message": _("Session expired")})
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
    user, created = CustomUser.objects.get_or_create(phone=phone)
    user.set_password(str(otp))
    user.last_login = timezone.now()
    if role == "broker":
        user.is_broker = True
    else:
        user.is_user = True
    user.is_staff = False
    user.is_active = True
    if code and code != "null":
        user.country_code = CountryCode.objects.filter(id=int(code)).first()
    else:
        user.country_code = CountryCode.objects.filter(id=1).first()
    user.save()
    profile_data = {}
    # check Profile
    if role == "user":
        request.session["user_login"] = user.pk
        uProfile, created = UserProfile.objects.get_or_create(user=user)
        if uProfile.img or uProfile.name or uProfile.state:
            profile_data = {
                "img": uProfile.img.url if uProfile.img else None,
                "name": uProfile.name if uProfile.name else None,
                "state_id": uProfile.state.pk if uProfile.state else None,
                "state_name": uProfile.state.name if uProfile.state else None,
                "city_id": uProfile.city.pk if uProfile.city else None,
                "city_name": uProfile.city.name if uProfile.city else None,
            }

    elif role == "broker":
        request.session["broker_login"] = user.pk
        bProfile, created = BrokerProfile.objects.get_or_create(user=user)
        if bProfile.img or bProfile.name or bProfile.state:
            profile_data = {
                "img": bProfile.img.url if bProfile.img else None,
                "name": bProfile.name if bProfile.name else None,
                "state_id": bProfile.state.pk if bProfile.state else None,
                "state_name": bProfile.state.name if bProfile.state else None,
                "city_id": bProfile.city.pk if bProfile.city else None,
                "city_name": bProfile.city.name if bProfile.city else None,
            }

    request.session.pop("role", None)

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

    if ustateid:
        state = State.objects.filter(id=ustateid).first()
        if state:
            uProfile.state = state

    if ucityid:
        city = City.objects.filter(id=ucityid).first()
        if city:
            uProfile.city = city

    uProfile.save()

    return JsonResponse(
        {
            "success": True,
            "message": _("Profile updated successfully"),
        }
    )


def broker_profile(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": _("Invalid request")})

    broker_id = request.session.get("broker_login")
    if not broker_id:
        return JsonResponse({"error": True, "message": _("Session expired")})

    broker = CustomUser.objects.filter(id=broker_id).first()

    if not broker:
        return JsonResponse({"error": True, "message": _("Broker not found")})

    bProfile, created = BrokerProfile.objects.get_or_create(user=broker)

    btheme = request.POST.get("btheme")
    blang = request.POST.get("blang")
    bimg = request.FILES.get("bimg")
    bname = request.POST.get("bname")
    bstateid = request.POST.get("bstateid")
    bcityid = request.POST.get("bcityid")

    if btheme and btheme != "null":
        bProfile.theme = Theme.objects.filter(id=btheme).first()
    else:
        bProfile.theme = Theme.objects.filter(id=1).first()

    if blang and blang != "null":
        bProfile.language = Language.objects.filter(id=blang).first()
    else:
        bProfile.language = Language.objects.filter(id=1).first()

    if bimg:
        bProfile.img = bimg

    if bname:
        bProfile.name = bname

    if bstateid:
        state = State.objects.filter(id=bstateid).first()
        if state:
            bProfile.state = state

    if bcityid:
        city = City.objects.filter(id=bcityid).first()
        if city:
            bProfile.city = city

    bProfile.save()

    return JsonResponse(
        {
            "success": True,
            "message": _("Profile updated successfully"),
        }
    )


def login_user(request):
    return login_with_otp(request, "user")


def login_broker(request):
    return login_with_otp(request, "broker")


def user_dashboard(request):
    user_id = request.session.get("user_login")
    if not user_id:
        return redirect("/login/")
    user = CustomUser.objects.filter(id=user_id, is_user=True, is_active=True).first()
    if not user:
        request.session.flush()
        return redirect("/login/")
    uProfile, created = UserProfile.objects.get_or_create(user=user)
    context = {"user": user, "uProfile": uProfile}
    return render(request, "user/dashboard.html", context)


def broker_dashboard(request):
    broker_id = request.session.get("broker_login")
    if not broker_id:
        return redirect("/broker/login/")
    broker = CustomUser.objects.get(id=broker_id)
    if not broker.is_broker:
        return redirect("/broker/login/")
    bProfile = BrokerProfile.objects.get(user=broker)
    return render(request, "broker/dashboard.html", {"bProfile": bProfile})


def user_logout(request):
    request.session.pop("user_login", None)
    request.session.pop("code", None)
    request.session.pop("phone", None)
    return redirect("/login/")


def broker_logout(request):
    request.session.pop("broker_login", None)
    request.session.pop("code", None)
    request.session.pop("phone", None)
    return redirect("/broker/login/")
