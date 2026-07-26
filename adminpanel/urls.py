from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("admin/login/", views.admin_login, name="admin-login"),
    path("admin/", views.admin_dashboard, name="admin-dashboard"),
    path("admin/logout", views.admin_logout, name="admin-logout"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
