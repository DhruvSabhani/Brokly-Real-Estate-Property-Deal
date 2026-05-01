from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone
import random
from datetime import timedelta
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("The phone number must be set")
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_broker", False)
        extra_fields.setdefault("is_user", False)
        return self.create_user(phone, password, **extra_fields)


class CountryCode(models.Model):
    country_code = models.CharField(max_length=10, unique=True)
    country_name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.country_code} ({self.country_name})"


class CustomUser(AbstractBaseUser, PermissionsMixin):
    country_code = models.ForeignKey(
        "CountryCode", on_delete=models.SET_NULL, null=True, blank=True
    )
    phone = models.CharField(max_length=15, unique=True, db_index=True)
    is_user = models.BooleanField(default=False)
    is_broker = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "phone"
    objects = CustomUserManager()

    def __str__(self) -> str:
        return self.phone


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
        return self.name


class City(models.Model):
    state = models.ForeignKey("State", on_delete=models.CASCADE, related_name="cities")
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["state", "name"]
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}, {self.state.name}"


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
        return self.name


def user_image_path(instance, filename):
    return f"user/{instance.user.phone}/{filename}"


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    img = models.ImageField(upload_to=user_image_path, blank=True, null=True)
    name = models.CharField(max_length=55, blank=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, blank=True
    )
    theme = models.ForeignKey(Theme, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"UserProfile ({self.user.phone})"


def broker_image_path(instance, filename):
    return f"broker/{instance.user.phone}/{filename}"


class BrokerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    img = models.ImageField(upload_to=broker_image_path, blank=True, null=True)
    name = models.CharField(max_length=55, blank=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, blank=True
    )
    theme = models.ForeignKey(Theme, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"BrokerProfile ({self.user.phone})"
