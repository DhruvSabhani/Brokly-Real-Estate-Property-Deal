from django.shortcuts import redirect
from functools import wraps
from accounts.models import CustomUser, UserProfile, PortalProfile
from common.models import ProfileAddresses


def user_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwarge):
        user_id = request.session.get("user_login")

        if not user_id:
            return redirect("/login/")

        user = CustomUser.objects.filter(
            id=user_id, is_user=True, is_active=True
        ).first()

        if not user:
            request.session.flush()
            return redirect("/login/")

        uProfile, created = UserProfile.objects.get_or_create(user=user)
        uAddress = ProfileAddresses.objects.filter(
            profile_role="user", profile_id=uProfile.pk, is_default=True, is_active=True
        ).first()

        request.user_obj = user
        request.uProfile = uProfile
        request.uAddress = uAddress

        return view_func(request, *args, **kwarge)

    return wrapper


def portal_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwarge):
        portal_id = request.session.get("portal_login")
        if not portal_id:
            return redirect("/portal/login/")
        user = CustomUser.objects.filter(
            id=portal_id, is_portal=True, is_active=True
        ).first()

        if not user:
            request.session.flush()
            return redirect("/portal/login/")

        pProfile, created = PortalProfile.objects.get_or_create(user=user)
        pAddress = ProfileAddresses.objects.filter(
            profile_role="portal",
            profile_id=pProfile.pk,
            is_default=True,
            is_active=True,
        ).first()

        request.portal_obj = user
        request.pProfile = pProfile
        request.pAddress = pAddress

        return view_func(request, *args, **kwarge)

    return wrapper
