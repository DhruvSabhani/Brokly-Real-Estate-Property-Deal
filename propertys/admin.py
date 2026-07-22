from django.contrib import admin
from .models import PropertyType, PropertyFacility, PropertyPreferred, Property

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
