from django.shortcuts import render, redirect
from accounts.models import *
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json


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
            return JsonResponse({"error": True, "message": "Invalid request"})
        code = data.get("code")
        phone = data.get("phone")
        otp = data.get("otp")
        request.session["role"] = role

        admin_user = CustomUser.objects.filter(
            phone=phone, is_superuser=True, is_staff=True
        ).exists()
        if admin_user:
            return JsonResponse({"error": True, "message": "Not valid number"})

        otp = generate_otp(phone)
        request.session["code"] = code
        request.session["phone"] = phone
        return JsonResponse({"success": True, "message": otp, "step": "otp"})

    countrycode = CountryCode.objects.filter(is_active=True)
    statemodal = State.objects.filter(country_code=1, is_active=True).all()

    context = {
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
        return JsonResponse({"error": True, "message": "Session expired"})
    otp = generate_otp(phone)
    return JsonResponse({"success": True, "message": otp})


def verify_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": True, "message": "Invalid request"})
    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": True, "message": "Invalid JSON"})
    code = request.session.get("code")
    phone = request.session.get("phone")
    otp = data.get("otp")
    role = request.session.get("role")

    if not phone or not role:
        return JsonResponse({"error": True, "message": "Session expired"})

    otp_record = (
        OTP.objects.filter(phone=phone, is_used=False).order_by("-created_at").first()
    )
    if not otp_record:
        return JsonResponse({"error": True, "message": "No OTP found"})
    if not otp_record.check_otp_hash(otp):
        return JsonResponse({"error": True, "message": "Invalid OTP"})
    if otp_record.is_expired:
        return JsonResponse({"error": True, "message": "OTP expried"})
    otp_record.is_used = True
    otp_record.save()

    user, created = CustomUser.objects.get_or_create(phone=phone)
    if role == "broker":
        user.is_broker = True
    else:
        user.is_user = True
    user.is_staff = False
    user.is_active = True
    user.country_code = CountryCode.objects.get(id=code)
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
                "state_id": uProfile.state.id if uProfile.state else None,
                "state_name": uProfile.state.name if uProfile.state else None,
                "city_id": uProfile.city.id if uProfile.city else None,
                "city_name": uProfile.city.name if uProfile.city else None,
            }

    elif role == "broker":
        request.session["broker_login"] = user.pk
        BrokerProfile.objects.get_or_create(user=user)
        # redirect_url = "/broker/"

    request.session.pop("role", None)

    return JsonResponse({"success": True, "step": "profile", "profile": profile_data})


def user_profile(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "• Invalid request"})

    uimg = request.FILES.get("uimg")
    uname = request.POST.get("uname")
    ustateid = request.POST.get("ustateid")
    ucityid = request.POST.get("ucityid")

    user_id = request.session.get("user_login")
    if not user_id:
        return JsonResponse({"error": True, "message": "Session expired"})

    try:
        user = CustomUser.objects.get(id=user_id)
        uProfile, created = UserProfile.objects.get_or_create(user=user)
    except UserProfile.DoesNotExist:
        return JsonResponse({"error": True, "message": "Profile not found"})

    if uimg:
        uProfile.img = uimg

    if uname:
        uProfile.name = uname

    if ustateid:
        uProfile.state = State.objects.get(id=ustateid)

    if ucityid:
        uProfile.city = City.objects.get(id=ucityid)
    uProfile.language = Language.objects.get(id=1)
    uProfile.theme = Theme.objects.get(id=1)

    uProfile.save()

    return JsonResponse(
        {
            "success": True,
            "message": "Profile updated successfully",
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
    user = CustomUser.objects.get(id=broker_id)
    if not user.is_broker:
        return redirect("/broker/login/")
    bProfile = BrokerProfile.objects.get(user=user)
    return render(request, "broker/dashboard.html", {"bProfile": bProfile})


def user_logout(request):
    request.session.pop("user_login", None)
    request.session.pop("code", None)
    request.session.pop("phone", None)
    return redirect("/login/")
