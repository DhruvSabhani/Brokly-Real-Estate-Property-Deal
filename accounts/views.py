from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from .models import OTP, CustomUser
from django.http import JsonResponse
import re

# from django.contrib.auth.models import User


def is_valid_phone(phone):
    return re.fullmatch(r"^[6-9][0-9]{9}$", phone)


# Create your views here.
def registerUser(request):
    if request.user.is_authenticated:
        return redirect("/")
    if request.method == "POST":
        phone = request.POST.get("phone")
        otp = request.POST.get("otp")
        if not phone or not is_valid_phone(phone):
            return JsonResponse(
                {
                    "error": True,
                    "message": "• Please enter a valid 10-digit phone number starting with 6-9.",
                }
            )
        if not otp:
            otp_obj = OTP.objects.create(phone=phone)
            print("User OTP: ", otp_obj.otp)
            return JsonResponse(
                {"success": True, "message": "OTP sent", "phone": phone}
            )
        otp_obj = OTP.objects.filter(phone=phone).last()
        if otp_obj and str(otp_obj.otp) == str(otp) and otp_obj.is_valid():
            otp_obj.is_used = True
            otp_obj.save()
            user, created = CustomUser.objects.get_or_create(
                phone=phone, defaults={"role": "user"}
            )
            login(request, user)
            return JsonResponse({"success": True, "redirect": "/", "phone": phone})
        return JsonResponse({"error": True, "message": "Invalid OTP"})
    return render(request, "accounts/user_login.html")


def user_logout(request):
    logout(request)
    return redirect("/register")


def userDeshboard(request):
    if request.user.is_anonymous:
        return redirect("/register")
    return render(request, "user/deshboard.html")


def registerBroker(request):
    if request.user.is_authenticated:
        return redirect("/")
    if request.method == "POST":
        phone = request.POST.get("phone")
        otp = request.POST.get("otp")
        if not phone or not is_valid_phone(phone):
            return JsonResponse(
                {
                    "error": True,
                    "message": "Please enter a valid 10-digit phone number starting with 6-9.",
                }
            )
        if not otp:
            otp_obj = OTP.objects.create(phone=phone)
            print("Broker OTP: ", otp_obj.otp)
            return JsonResponse(
                {"success": True, "message": "OTP sent", "phone": phone}
            )
        otp_obj = OTP.objects.filter(phone=phone).last()
        if otp_obj and str(otp_obj.otp) == str(otp) and otp_obj.is_valid():
            otp_obj.is_used = True
            otp_obj.save()
            user, created = CustomUser.objects.get_or_create(
                phone=phone, defaults={"role": "broker"}
            )
            login(request, user)
            return JsonResponse(
                {"success": True, "redirect": "brokerDeshboard", "phone": phone}
            )
        return JsonResponse({"error": True, "message": "Invalid OTP"})

    return render(request, "accounts/broker_login.html")


def brokerDeshboard(request):
    if request.user.is_anonymous:
        return redirect("/broker/register")
    return render(request, "broker/deshboard.html")


def broker_logout(request):
    logout(request)
    return redirect("/broker/register")
