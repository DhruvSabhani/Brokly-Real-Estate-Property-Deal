from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    # path(
    #     "change-language/",
    #     views.change_panel_language,
    #     name="change_language",
    # ),
    # User
    path("", views.user_dashboard, name="user-dashboard"),
    path("home/", views.user_dashboard, name="user-dashboard"),
    path("login/", views.login_user, name="brokly-login"),
    path("resend-otp/", views.resend_otp, name="resend-otp"),
    path("verify-otp/", views.verify_otp, name="verify-otp"),
    path("user/profile/", views.user_profile, name="user-profile"),
    path("near-me/", views.user_near_me, name="user-near-me"),
    path("shortlisted/", views.user_shortlisted, name="user-shortlisted"),
    path("messages/", views.user_messages, name="user-messages"),
    path("help/", views.user_help, name="user-help"),
    path("setting/", views.user_setting, name="user-setting"),
    path("user/logout/", views.user_logout, name="user-logout"),
    # Portal
    path("portal/", views.portal_dashboard, name="portal-dashboard"),
    path("portal/dashboard/", views.portal_dashboard, name="portal-dashboard"),
    path("portal/login/", views.login_portal, name="portal-login"),
    path("portal/profile/", views.portal_profile, name="portal-profile"),
    path("portal/help/", views.portal_help, name="portal-help"),
    path("portal/setting/", views.portal_setting, name="portal-setting"),
    path("portal/logout/", views.portal_logout, name="portal-logout"),
    # state
    path("get-states/", views.get_states, name="get-states"),
    # city
    path("get-cities/", views.get_cities, name="get-cities"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
