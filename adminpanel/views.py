# from urllib import request
from django.conf import settings
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from accounts.models import CustomUser
from django.utils.translation import gettext as _
from .utils import admin_required

# Create your views here.


def admin_login(request):
    if request.session.get("admin_login"):
        return redirect("admin-dashboard")

    if request.method == "POST":
        phone = request.POST.get("phone")
        password = request.POST.get("password")

        admin_user = CustomUser.objects.filter(phone=phone).first()

        if not admin_user:
            return JsonResponse({"error": True, "message": _("Invalid phone number.")})
        if not admin_user.is_superuser or not admin_user.is_staff:
            return JsonResponse({"error": True, "message": _("Access denied.")})
        if not check_password(password, str(admin_user.password)):
            return JsonResponse({"error": True, "message": _("Invalid password.")})

        request.session["admin_login"] = admin_user.pk

        return JsonResponse({"success": True, "redirect": "/admin/"})
    return render(request, "adminpanel/adminlogin.html")


@admin_required
def admin_dashboard(request):
    context = {"admin_user": request.admin_user}
    return render(request, "adminpanel/admindashboard.html", context)


def admin_logout(request):
    request.session.pop("admin_login", None)
    return redirect("admin-login")
