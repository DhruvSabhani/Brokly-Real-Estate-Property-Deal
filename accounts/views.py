from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from .models import *
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import re

# from django.contrib.auth.models import User


def is_valid_phone(phone):
    return re.fullmatch(r"^[6-9][0-9]{9}$", phone)


def login_with_otp(request, role):
    if request.user.is_authenticated:
        # if role == "user" and request.user.is_user:
        #     return redirect("/")
        if role == "broker" and request.user.is_broker:
            return redirect("/broker/dashboard/")
    if request.method == "POST":
        phone = request.POST.get("phone")
        otp = request.POST.get("otp")
        img = request.FILES.get("img")
        uname = request.POST.get("uname")
        state = request.POST.get("state")
        city = request.POST.get("city")

        if not phone or not is_valid_phone(phone):
            return JsonResponse(
                {
                    "error": True,
                    "message": "Please enter a valid 10-digit phone number starting with 6-9.",
                }
            )
        if not otp:
            otp_obj = OTP.objects.create(phone=phone)
            print(f"OTP for {phone} : {otp_obj.otp}")
            return JsonResponse({"success": True, "message": "OTP sent"})

        otp_obj = OTP.objects.filter(phone=phone).last()

        if otp_obj and not otp_obj.is_used and otp_obj.is_valid():
            otp_obj.is_used = True
            otp_obj.save()

            user, created = CustomUser.objects.get_or_create(phone=phone)
            if role == "user":
                user.is_user = True
            elif role == "broker":
                user.is_broker = True
            user.is_active = True
            user.save()

            if role == "user":
                profile, created = UserProfile.objects.get_or_create(user=user)
                profile.img = img
                profile.name = uname
                profile.state = state
                profile.city = city
                profile.save()
            elif role == "broker":
                BrokerProfile.objects.get_or_create(user=user)

            login(request, user)

            redirect_url = "/register" if role == "user" else "/broker/dashboard/"
            return JsonResponse(
                {"success": True, "message": "Successfully", "redirect": redirect_url}
            )

        return JsonResponse({"error": True, "message": "Invalid or expired OTP"})
    return render(
        request,
        "accounts/user_login.html" if role == "user" else "accounts/broker_login.html",
    )


def user_login(request):
    return login_with_otp(request, "user")


def broker_login(request):
    return login_with_otp(request, "broker")


@login_required(login_url="/register/")
def userDashboard(request):
    if not request.user.is_user:
        return redirect("/register/")
    profile = UserProfile.objects.get(user=request.user)
    return render(request, "user/dashboard.html", {"profile": profile})


@login_required(login_url="/broker/register/")
def brokerDashboard(request):
    if not request.user.is_broker:
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
