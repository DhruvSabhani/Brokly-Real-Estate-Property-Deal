from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from propertys import views

urlpatterns = [
    path("portal/property-add/", views.portal_property_create, name="portal_property_create"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
