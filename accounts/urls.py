from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from accounts import views

urlpatterns = [
    # path(
    #     "change-language/",
    #     views.change_panel_language,
    #     name="change_language",
    # ),
    # User
    path("", views.user_dashboard, name="user_dashboard"),
    path("home/", views.user_dashboard, name="user_dashboard"),
    path("login/", views.login_user, name="brokly_login"),
    path("resend-otp/", views.resend_otp, name="resend_otp"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    path("user-profile/", views.user_profile, name="user_profile"),
    path("near-me/", views.near_me, name="near_me"),
    path("shortlisted/", views.shortlisted, name="shortlisted"),
    path("messages/", views.messages, name="messages"),
    path("help/", views.user_help, name="user_help"),
    path("setting/", views.user_setting, name="user_setting"),
    path("user-logout/", views.user_logout, name="user_logout"),
    # Portal
    path("portal/", views.portal_dashboard, name="portal_dashboard"),
    path("portal/dashboard/", views.portal_dashboard, name="portal_dashboard"),
    path("portal/login/", views.login_portal, name="portal_login"),
    path("portal-profile/", views.portal_profile, name="portal_profile"),
    path("portal/help/", views.portal_help, name="portal_help"),
    path("portal/setting/", views.portal_setting, name="portal_setting"),
    path("portal-logout/", views.portal_logout, name="portal_logout"),
    # state
    path("get-states/", views.get_states, name="get_states"),
    # city
    path("get-cities/", views.get_cities, name="get_cities"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
