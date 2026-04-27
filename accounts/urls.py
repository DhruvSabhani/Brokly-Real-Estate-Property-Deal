from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from accounts import views

urlpatterns = [
    # User
    path("", views.userDeshboard, name="brokly_deshboard"),
    path("register/", views.registerUser, name="Login to Brokly"),
    path("logout/", views.user_logout, name="Logout to Brokly"),
    # Broker
    path("broker/register/", views.registerBroker, name="Login to Broker"),
    path("broker/deshboard/", views.brokerDeshboard, name="Broker Deshboard"),
    path("broker/logout/", views.broker_logout, name="Logout to Broker"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
