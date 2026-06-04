from django.views.i18n import set_language
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from accounts import views

urlpatterns = [
    # Language
    # path("i18n/setlang/", set_language, name="set_language"),
    path(
        "change-language/",
        views.change_panel_language,
        name="change_language",
    ),
    # User
    path("", views.user_dashboard, name="brokly_dashboard"),
    path("login/", views.login_user, name="brokly_login"),
    path("resend-otp/", views.resend_otp, name="resend_otp"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    path("user-profile/", views.user_profile, name="user_profile"),
    path("user-logout/", views.user_logout, name="user_logout"),
    # Broker
    path("broker/", views.broker_dashboard, name="broker_dashabord"),
    path("broker/login/", views.login_broker, name="broker_login"),
    path("broker-profile/", views.broker_profile, name="broker_profile"),
    path("broker-logout/", views.broker_logout, name="broker_logout"),
    # state
    path("get-states/", views.get_states, name="get_states"),
    # city
    path("get-cities/", views.get_cities, name="get_cities"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
