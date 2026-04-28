import json
import re
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from .models import *
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils import timezone
from datetime import timedelta


def is_valid_phone(phone):
    return re.fullmatch(r"^[6-9][0-9]{9}$", phone)


@ensure_csrf_cookie
def login_with_otp(request, role):
    if request.method == "POST":
        phone = request.POST.get("phone")
        otp = request.POST.get("otp")
        img = request.FILES.get("img")
        uname = request.POST.get("uname")
        state_id = request.POST.get("state")
        city_id = request.POST.get("city")

        state = State.objects.filter(id=state_id).first()
        city = City.objects.filter(id=city_id).first()

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
            return JsonResponse(
                {
                    "success": True,
                    "message": "OTP sent",
                    "step": "otp",
                }
            )

        otp_obj = OTP.objects.filter(phone=phone).order_by("-created_at").first()

        if not otp_obj:
            return JsonResponse({"error": True, "message": "No OTP found"})
        if otp_obj.is_used:
            return JsonResponse({"error": True, "message": "OTP already used"})
        if timezone.now() > otp_obj.created_at + timedelta(minutes=2):
            return JsonResponse({"error": True, "message": "OTP expired"})
        if otp_obj.otp != otp:
            return JsonResponse({"error": True, "message": "Invalid OTP"})

        otp_obj.is_used = True
        otp_obj.save()

        user, _ = CustomUser.objects.get_or_create(phone=phone)

        if role == "user":
            user.is_user = True
        elif role == "broker":
            user.is_broker = True

        user.is_active = True
        user.save()
        login(request, user)
        if role == "user" and hasattr(user, "userprofile"):
            UserProfile.objects.get_or_create(user=user)
            return JsonResponse(
                {
                    "success": True,
                    "message": "OTP verified",
                    "step": "profile",
                }
            )

        elif role == "broker":
            BrokerProfile.objects.get_or_create(user=user)

        if request.user.is_authenticated:
            profile, _ = UserProfile.objects.get_or_create(user=user)

            if not uname:
                return JsonResponse({"error": True, "message": "Username required"})
            if img:
                profile.img = img

            profile.name = uname
            profile.state = state
            profile.city = city
            profile.theme = Theme.objects.filter(id=1).first()
            profile.language = Language.objects.filter(id=1).first()
            profile.save()

            return JsonResponse(
                {"success": True, "message": "Successfully", "redirect": "/"}
            )

    return render(
        request,
        "accounts/user_login.html" if role == "user" else "accounts/broker_login.html",
    )


# def login_with_otp(request, role):
#     if request.user.is_authenticated:
#         # if role == "user" and request.user.is_user:
#         #     return redirect("/")
#         if role == "broker" and request.user.is_broker:
#             return redirect("/broker/dashboard/")
#     if request.method == "POST":
#         phone = request.POST.get("phone")
#         otp = request.POST.get("otp")

#         if not phone or not is_valid_phone(phone):
#             return JsonResponse(
#                 {
#                     "error": True,
#                     "message": "Please enter a valid 10-digit phone number starting with 6-9.",
#                 }
#             )
#         if not otp:
#             otp_obj = OTP.objects.create(phone=phone)
#             print(f"OTP for {phone} : {otp_obj.otp}")
#             return JsonResponse({"success": True, "message": "OTP sent"})

#         otp_obj = OTP.objects.filter(phone=phone).last()

#         if otp_obj and not otp_obj.is_used and otp_obj.is_valid():
#             otp_obj.is_used = True
#             otp_obj.save()

#             user, created = CustomUser.objects.get_or_create(phone=phone)
#             if role == "user":
#                 user.is_user = True
#             elif role == "broker":
#                 user.is_broker = True
#             user.is_active = True
#             user.save()

#             if role == "user":
#                 profile, created = UserProfile.objects.get_or_create(user=user)

#             elif role == "broker":
#                 BrokerProfile.objects.get_or_create(user=user)

#             login(request, user)

#             redirect_url = "/register/" if role == "user" else "/broker/dashboard/"
#             return JsonResponse(
#                 {"success": True, "message": "Successfully", "redirect": redirect_url}
#             )

#         return JsonResponse({"error": True, "message": "Invalid or expired OTP"})
#     return render(
#         request,
#         "accounts/user_login.html" if role == "user" else "accounts/broker_login.html",
#     )


# @login_required
# def user_profile(request):
#     if request.method == "POST" and request.user.is_user:
#         img = request.FILES.get("img")
#         uname = request.POST.get("uname")
#         state_id = request.POST.get("state")
#         city_id = request.POST.get("city")

#         state = State.objects.filter(id=state_id).first()
#         city = City.objects.filter(id=city_id).first()

#         profile, created = UserProfile.objects.get_or_create(user=request.user)
#         profile.img = img
#         profile.name = uname
#         profile.state = state
#         profile.city = city
#         profile.save()

#         return redirect("/")

#     return render(request, "accounts/user_login.html")


def user_login(request):
    return login_with_otp(request, "user")


def broker_login(request):
    return login_with_otp(request, "broker")


@login_required(login_url="/register/")
def userDashboard(request):
    if not request.user.is_user:
        return redirect("/register/")
    if request.user.is_staff:
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
