import re
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from .models import *
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie


def is_valid_phone(phone):
    return re.fullmatch(r"^[6-9][0-9]{9}$", phone)


@ensure_csrf_cookie
def login_with_otp(request, role):
    # Already login in
    if request.user.is_authenticated:
        if role == "user" and request.user.is_user:
            return redirect("/")
        if role == "broker" and request.user.is_broker:
            return redirect("/broker/dashboard/")

    # POST request
    if request.method == "POST":
        phone = request.POST.get("phone")
        otp = request.POST.get("otp")

        # check phone number
        if not phone or not is_valid_phone(phone):
            return JsonResponse(
                {
                    "error": True,
                    "message": "Please enter a valid 10-digit phone number starting with 6-9.",
                }
            )
        # check otp
        if not otp:
            otp_obj = OTP.objects.create(phone=phone)
            print(f"OTP for {phone} : {otp_obj._raw_otp}")
            return JsonResponse(
                {
                    "success": True,
                    "message": "OTP sent",
                    "step": "otp",
                }
            )
        # OTP Verify
        otp_recode = (
            OTP.objects.filter(phone=phone, is_used=False)
            .order_by("-created_at")
            .first()
        )
        if not otp_recode or not otp_recode.check_otp_hash(otp):
            return JsonResponse({"error": True, "message": "Invalid OTP"})
        if otp_recode.is_expired:
            return JsonResponse({"error": True, "message": "OTP expired"})
        otp_recode.is_used = True
        otp_recode.save()
        # CustomUser Login
        user, created = CustomUser.objects.get_or_create(phone=phone)
        if role == "user":
            user.is_user = True
        else:
            user.is_broker = True
        user.is_active = True
        user.save()
        login(request, user)
        # Profile check
        if role == "user":
            profile, created = UserProfile.objects.get_or_create(user=user)

            uname = request.POST.get("uname")
            if created or not profile.name:
                if not uname:  # No name provided in the current request
                    return JsonResponse(
                        {
                            "success": True,
                            "message": "OTP Verified Successfully",
                            "step": "profile",
                        }
                    )
            if not uname:
                return JsonResponse({"error": True, "message": "Name is required"})
            if uname:
                profile.name = uname
                profile.save()
                return JsonResponse(
                    {
                        "success": True,
                        "message": "Profile Update Seccessfully",
                        "redirect": "/",
                    }
                )
            return JsonResponse(
                {"success": True, "message": "Login Successfully", "redirect": "/"}
            )

        elif role == "broker":
            BrokerProfile.objects.get_or_create(user=user)
            return JsonResponse(
                {
                    "success": True,
                    "message": "Broker Login Successfully",
                    "redirect": "/broker/dashboard/",
                }
            )
    return render(
        request,
        "accounts/user_login.html" if role == "user" else "accounts/broker_login.html",
    )


def user_login(request):
    return login_with_otp(request, "user")


def broker_login(request):
    return login_with_otp(request, "broker")


@login_required(login_url="/register")
def userDashboard(request):
    if request.user.is_staff or not request.user.is_user:
        return redirect("/register/")
    profile = UserProfile.objects.get(user=request.user)
    return render(request, "user/dashboard.html", {"profile": profile})


@login_required(login_url="/broker/register")
def brokerDashboard(request):
    if request.user.is_staff or not request.user.is_broker:
        return redirect("/broker/register/")
    profile = BrokerProfile.objects.get(user=request.user)
    return render(request, "broker/dashboard.html", {"profile": profile})


def user_logout(request):
    if request.user.is_authenticated:
        request.user.is_user = False
        request.user.save()
    logout(request)
    return redirect("/register")


def broker_logout(request):
    if request.user.is_authenticated:
        request.user.is_broker = False
        request.user.save()
    logout(request)
    return redirect("/broker/register")
