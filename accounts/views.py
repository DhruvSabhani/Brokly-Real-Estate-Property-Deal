from django.shortcuts import render, redirect
from .models import *
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
import json


def generate_otp(phone):
    otp_obj = OTP.objects.create(phone=phone)
    print(f"OTP for {phone} : {otp_obj._raw_otp}")
    return otp_obj._raw_otp


@ensure_csrf_cookie
def login_with_otp(request, role):
    # if request.user.is_authenticated:
    # if request.user.is_user == "user":
    #     return redirect(user_dashaboard)
    # elif request.user.is_broker:
    #     return redirect(broker_dashaboard)
    # elif request.user.is_staff:
    #     return redirect("/admin")
    # else:
    #     return redirect("/")

    if request.method == "POST":
        data = json.loads(request.body)
        code = data.get("code")
        phone = data.get("phone")
        otp = data.get("otp")
        request.session["role"] = role

        # create OTP
        if not otp:
            otp = generate_otp(phone)
            request.session["code"] = code
            request.session["phone"] = phone
            return JsonResponse({"success": True, "message": otp, "step": "otp"})

    country_code = CountryCode.objects.filter(is_active=True).all()

    context = {
        "country_code": country_code,
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
    user, _ = CustomUser.objects.get_or_create(phone=phone)
    if role == "broker":
        user.is_broker = True
    else:
        user.is_user = True
    user.is_staff = False
    user.is_active = True
    user.country_code = CountryCode.objects.get(id=code)
    user.save()

    login(request, user)

    # check Profile
    if role == "user":
        UserProfile.objects.get_or_create(user=user)
    if role == "broker":
        BrokerProfile.objects.get_or_create(user=user)

    request.session.pop("role", None)

    return JsonResponse({"success": True, "step": "profile"})

def login_user(request):
    return login_with_otp(request, "user")


def login_broker(request):
    return login_with_otp(request, "broker")


@login_required(login_url="/login")
def user_dashaboard(request):
    if not request.user.is_user:
        return redirect("/login/")
    uProfile = UserProfile.objects.get(user=request.user)
    return render(request, "user/dashboard.html", {"uProfile": uProfile})


@login_required(login_url="/broker/login")
def broker_dashaboard(request):
    return render(request, "broker/dashboard.html")
