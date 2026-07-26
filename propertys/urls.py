from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path(
        "portal/property-add/",
        views.portal_property_create,
        name="portal-property-create",
    ),
    path(
        "portal/property/create/",
        views.portal_property_store,
        name="portal-property-store",
    ),
    path("portal/propertys/", views.portal_property_list, name="portal-property-list"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
