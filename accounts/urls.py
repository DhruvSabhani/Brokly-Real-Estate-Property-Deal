from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from accounts import views

urlpatterns = [
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
    # state
    path("get-states/", views.get_states, name="get_states"),
    # city
    path("get-cities/", views.get_cities, name="get_cities"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
