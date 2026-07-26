from django.contrib import admin
from django.apps import apps
from .models import *

# Register your models here.


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "type_name",
        "type_name_gu",
        "is_active",
        "update_at",
        "create_at",
    )
    list_filter = ("is_active",)
    search_fields = ("type_name", "type_name_gu")


@admin.register(PropertyPreferred)
class PropertyPreferredAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "preferred_name",
        "preferred_name_gu",
        "is_active",
        "update_at",
        "create_at",
    )
    list_filter = ("is_active",)
    search_fields = ("preferred_name", "preferred_name_gu")


@admin.register(PropertyFacility)
class PropertyFacilityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "facilities_name",
        "facilities_name_gu",
        "is_active",
        "update_at",
        "create_at",
    )
    list_filter = ("is_active",)
    search_fields = ("facilities_name", "facilities_name_gu")


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "is_active",
        "profile",
        "type",
        "property_name",
        "property_price",
        "property_price_period",
        "property_bhk_type",
        "property_purpose",
        "get_preferred",
        "get_facilities",
        "property_contact",
        "property_description",
        "update_at",
        "create_at",
    )
    list_filter = ("is_active",)
    search_fields = (
        "profile",
        "property_name",
        "property_price",
    )

    @admin.display(description="property_preferred")
    def get_preferred(self, obj):
        return ", ".join(
            [preferred.preferred_name for preferred in obj.property_preferred.all()]
        )

    @admin.display(description="property_facilities")
    def get_facilities(self, obj):
        return ", ".join(
            [facilities.facilities_name for facilities in obj.property_facilities.all()]
        )


for model in apps.get_app_config("propertys").get_models():
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass
