from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from accounts import views

urlpatterns = [
    # User
    path("", views.user_dashaboard, name="brokly_dashboard"),
    path("login/", views.login_user, name="brokly_login"),
    path("resend-otp/", views.resend_otp, name="resend_otp"),
    path("verify-otp/", views.verify_otp, name="verify_otp"),
    # Broker
    path("broker/", views.broker_dashaboard, name="broker_dashabord"),
    path("broker/login/", views.login_broker, name="broker_login"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
