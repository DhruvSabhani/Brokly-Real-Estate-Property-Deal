from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = "propertys"

urlpatterns = [
    path(
        "portal/property/create/",
        views.portal_property_create,
        name="portal_property_create",
    ),
    path(
        "portal/property/store/",
        views.portal_property_store,
        name="portal_property_store",
    ),
    path(
        "portal/property/location/store/",
        views.portal_property_location_store,
        name="portal_property_location_store",
    ),
    path(
        "portal/property/photo/store/",
        views.portal_property_photo_store,
        name="portal_property_photo_store",
    ),
    path(
        "portal/property/review/",
        views.portal_property_create_review,
        name="portal_property_create_review",
    ),
    path(
        "portal/property/disabled-list/",
        views.portal_property_create_disabled_list,
        name="portal_property_create_disabled_list",
    ),
    path(
        "portal/property/active-list/",
        views.portal_property_create_active_list,
        name="portal_property_create_active_list",
    ),
    path(
        "portal/property/active-listings/",
        views.portal_property_active_listings,
        name="portal_property_active_listings",
    ),
    path(
        "portal/property/disabled-listings/",
        views.portal_property_disabled_listings,
        name="portal_property_disabled_listings",
    ),
    path(
        "portal/property/disabled/<int:pro_id>/",
        views.portal_property_active_listings_disabled,
        name="portal_property_active_listings_disabled",
    ),
    path(
        "portal/property/active/<int:pro_id>/",
        views.portal_property_disabled_listings_active,
        name="portal_property_disabled_listings_active",
    ),
    path(
        "portal/property/delete/<int:pro_id>/",
        views.portal_property_active_disabled_listings_delete,
        name="portal_property_active_disabled_listings_delete",
    ),
    # state
    path("portal/get/states/", views.portal_get_states, name="portal_get_states"),
    # city
    path("portal/get/cities/", views.portal_get_cities, name="portal_get_cities"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
