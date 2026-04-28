from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from accounts import views

urlpatterns = [
    # User
    path("", views.userDashboard, name="brokly_dashboard"),
    path("register/", views.user_login, name="login_to_brokly"),
    # path("user_profile/", views.user_profile, name="user_profile"),
    path("logout/", views.user_logout, name="logout_to_brokly"),
    # Broker
    path("broker/register/", views.broker_login, name="login_to_broker"),
    path("broker/dashboard/", views.brokerDashboard, name="broker_dashboard"),
    path("broker/logout/", views.broker_logout, name="logout_to_broker"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
