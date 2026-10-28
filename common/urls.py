from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = "common"

urlpatterns = [
    # add address
    path(
        "profile/address/add/",
        views.add_profile_address,
        name="add_profile_address",
    ),
    # default address select
    path(
        "profile/address/<int:address_id>/default-select/",
        views.default_address_select,
        name="default_address_select",
    ),
    # select address edit
    path(
        "profile/address/edit/<int:address_id>/",
        views.profile_address_edit,
        name="profile_address_edit",
    ),
    # select address delete
    path(
        "profile/address/<int:address_id>/delete/",
        views.profile_address_delete,
        name="profile_address_delete",
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
