from django.contrib import admin
from django.apps import apps
from accounts.models import *


# Register your models here.
@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ("phone", "is_used", "expires_at", "created_at", "is_expired_status")
    search_fields = ("phone",)
    list_filter = ("is_used", "created_at")
    readonly_fields = ("otp_hash", "created_at", "expires_at")

    @admin.display(boolean=True, description="Has Expired?")
    def is_expired_status(self, obj):
        return obj.is_expired


models = apps.get_app_config("accounts").get_models()
for model in models:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass
