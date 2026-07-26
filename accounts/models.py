from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone
import random
from django.contrib.auth.hashers import make_password, check_password
import os
import uuid
from datetime import timedelta

# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required.")
        user_admin = self.model(phone=phone, **extra_fields)
        user_admin.set_password(password)
        user_admin.save(using=self._db)
        return user_admin

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_portal", False)
        extra_fields.setdefault("is_user", False)
        return self.create_user(phone, password, **extra_fields)


class CountryCode(models.Model):
    country_code = models.CharField(max_length=10, unique=True)
    country_name = models.CharField(max_length=255, unique=True)
    country_name_gu = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.country_name)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    country_code = models.ForeignKey(
        CountryCode,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    password = models.CharField(max_length=255, null=True, blank=True)
    is_superuser = models.BooleanField(default=False)
    phone = models.CharField(max_length=15, unique=True, db_index=True)
    full_phone = models.CharField(
        max_length=30, db_index=True, unique=True, null=True, blank=True
    )
    is_user = models.BooleanField(default=False)
    is_portal = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()
    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["country_code", "phone"], name="unique_country_phone"
            )
        ]

    def save(self, *args, **kwargs):
        if self.country_code and self.phone:
            self.full_phone = f"{self.country_code.country_code}{self.phone}"
        else:
            self.full_phone = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_phone or self.phone


class OTP(models.Model):
    phone = models.CharField(max_length=15, db_index=True)
    otp_hash = models.CharField(max_length=255)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    _raw_otp = None

    def set_otp(self, raw_otp):
        self.otp_hash = make_password(raw_otp)

    def check_otp_hash(self, raw_otp):
        return check_password(raw_otp, self.otp_hash)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def save(self, *args, **kwargs):
        if not self.pk:
            raw_otp = str(random.randint(100000, 999999))
            self._raw_otp = raw_otp
            self.set_otp(raw_otp)
            if not self.expires_at:
                self.expires_at = timezone.now() + timedelta(minutes=2)
        super().save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(fields=["phone", "created_at"]),
        ]
        verbose_name = "OTP"
        verbose_name_plural = "OTPs"


class State(models.Model):
    country_code = models.ForeignKey(
        "CountryCode", on_delete=models.SET_NULL, null=True, blank=True
    )
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["country_code", "name"]
        ordering = ["name"]

    def __str__(self):
        return str(self.name)


class City(models.Model):
    state = models.ForeignKey("State", on_delete=models.CASCADE, related_name="cities")
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["state", "name"]
        ordering = ["name"]

    def __str__(self):
        return str(self.name)


class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["code"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Theme(models.Model):
    name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return str(self.name)


def user_image_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("users", str(instance.user.phone), filename)


class UserProfile(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="user_profile"
    )
    img = models.ImageField(upload_to=user_image_path, blank=True, null=True)
    name = models.CharField(max_length=55, blank=True)
    language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, blank=True
    )
    theme = models.ForeignKey(Theme, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user.phone)

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_img = UserProfile.objects.get(pk=self.pk).img
                if old_img and old_img != self.img:
                    if os.path.isfile(old_img.path):
                        os.remove(old_img.path)
            except UserProfile.DoesNotExist:
                pass
        super().save(*args, **kwargs)


def portal_image_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("portal", str(instance.user.phone), filename)


class PortalProfile(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="portal_profile"
    )
    img = models.ImageField(upload_to=portal_image_path, blank=True, null=True)
    name = models.CharField(max_length=55, blank=True)
    language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, blank=True
    )
    theme = models.ForeignKey(Theme, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user.phone)

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_img = PortalProfile.objects.get(pk=self.pk).img
                if old_img and old_img != self.img:
                    if os.path.isfile(old_img.path):
                        os.remove(old_img.path)
            except PortalProfile.DoesNotExist:
                pass
        super().save(*args, **kwargs)
