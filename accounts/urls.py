from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = "accounts"

urlpatterns = [
    path(
        "change-language/",
        views.change_panel_language,
        name="change_panel_language",
    ),
    # User
    path("get-states/", views.get_states, name="get_states"),
    path("get-cities/", views.get_cities, name="get_cities"),
    path("", views.user_dashboard, name="user_dashboard"),
    path("home/", views.user_dashboard, name="user_dashboard"),
    path("login/", views.login_user, name="brokly_login"),
    path("resend-otp/", views.resend_otp, name="resend_otp"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    path("user/profile/", views.user_profile, name="user_profile"),
    path("near-me/", views.user_near_me, name="user_near_me"),
    path("shortlisted/", views.user_shortlisted, name="user_shortlisted"),
    path("messages/", views.user_messages, name="user_messages"),
    path("help/", views.user_help, name="user_help"),
    path("settings/", views.user_settings, name="user_settings"),
    path(
        "settings/update-profile/",
        views.user_profile_update,
        name="user_profile_update",
    ),
    path("user/logout/", views.user_logout, name="user_logout"),
    # Portal
    path("portal/get-states/", views.get_states, name="get_states"),
    path("portal/get-cities/", views.get_cities, name="get_cities"),
    path("portal/", views.portal_dashboard, name="portal_dashboard"),
    path("portal/dashboard/", views.portal_dashboard, name="portal_dashboard"),
    path("portal/login/", views.login_portal, name="portal_login"),
    path("portal/profile/", views.portal_profile, name="portal_profile"),
    path("portal/help/", views.portal_help, name="portal_help"),
    path("portal/settings/", views.portal_settings, name="portal_settings"),
    path(
        "portal/settings/update-profile/",
        views.portal_profile_update,
        name="portal_profile_update",
    ),
    path("portal/logout/", views.portal_logout, name="portal_logout"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
