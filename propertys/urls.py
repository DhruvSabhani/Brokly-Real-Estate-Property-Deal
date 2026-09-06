from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path(
        "portal/property/create/",
        views.portal_property_create,
        name="portal-property-create",
    ),
    path(
        "portal/property/store/",
        views.portal_property_store,
        name="portal-property-store",
    ),
    path(
        "portal/property/location/store/",
        views.portal_property_location_store,
        name="portal-property-location-store",
    ),
    path(
        "portal/property/photo/store/",
        views.portal_property_photo_store,
        name="portal-property-photo-store",
    ),
    path(
        # "portal/property/review/<int:pro_id>/<slug:pro_slug>/",
        "portal/property/review/",
        views.portal_property_create_review,
        name="portal-property-create-review",
    ),
    path(
        "portal/property/disabled-list/",
        views.portal_property_create_disabled_list,
        name="portal-property-create-disabled-list",
    ),
    path(
        "portal/property/active-list/",
        views.portal_property_create_active_list,
        name="portal-property-create-active-list",
    ),
    path(
        "portal/property/active-listings/",
        views.portal_property_active_listings,
        name="portal-property-active-listings",
    ),
    path(
        "portal/property/disabled-listings/",
        views.portal_property_disabled_listings,
        name="portal-property-disabled-listings",
    ),
    path(
        "portal/property/disabled/<int:pro_id>/",
        views.portal_property_active_listings_disabled,
        name="portal-property-active-listings-disabled",
    ),
    path(
        "portal/property/active/<int:pro_id>/",
        views.portal_property_disabled_listings_active,
        name="portal-property-disabled-listings-active",
    ),
    path(
        "portal/property/delete/<int:pro_id>/",
        views.portal_property_active_disabled_listings_delete,
        name="portal-property-active-disabled-listings-delete",
    ),
    # state
    path("portal/get/states/", views.portal_get_states, name="portal-get-states"),
    # city
    path("portal/get/cities/", views.portal_get_cities, name="portal-get-cities"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
