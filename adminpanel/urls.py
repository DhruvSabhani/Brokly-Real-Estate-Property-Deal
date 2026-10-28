from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = "adminpanel"

urlpatterns = [
    path("admin/login/", views.admin_login, name="admin_login"),
    path("admin/", views.admin_dashboard, name="admin_dashboard"),
    path("admin/logout", views.admin_logout, name="admin_logout"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
