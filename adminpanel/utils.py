from django.shortcuts import redirect
from functools import wraps
from accounts.models import CustomUser


def admin_required(view_func):
    @wraps(view_func)
    def wrapper(requset, *args, **kwargs):
        admin_id = requset.session.get("admin_login")
        if not admin_id:
            return redirect("admin-login")
        try:
            admin = CustomUser.objects.get(
                pk=admin_id, is_superuser=True, is_staff=True
            )
        except CustomUser.DoesNotExist:
            requset.session.pop("admin_login", None)
            return redirect("admin_login")
        if not admin.is_superuser:
            requset.session.pop("admin_login", None)
            return redirect("admin_login")

        requset.admin_user = admin
        return view_func(requset, *args, **kwargs)

    return wrapper
