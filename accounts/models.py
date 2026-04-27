from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone
import random

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
        return self.create_user(phone, password, **extra_fields)


class CountryCode(models.Model):
    country_code = models.CharField(max_length=10, unique=True)
    country_name = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.country_code} ({self.country_name})"


class CustomUser(AbstractBaseUser, PermissionsMixin):
    country_code = models.ForeignKey(CountryCode, on_delete=models.SET_NULL, null=True)
    phone = models.CharField(max_length=15, unique=True, db_index=True)
    is_user = models.BooleanField(default=False)
    is_broker = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self) -> str:
        return self.phone

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class OTP(models.Model):
    phone = models.CharField(max_length=15, blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.otp:
            self.otp = str(random.randint(100000, 999999))
        super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() - self.created_at < timezone.timedelta(minutes=5)

    def __str__(self):
        return f"{self.phone} - {self.otp}"


class State(models.Model):
    country_code = models.ForeignKey(CountryCode, on_delete=models.SET_NULL, null=True)
    state = models.CharField(max_length=255, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.state


class City(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True)
    city = models.CharField(max_length=255, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.city


class Language(models.Model):
    language_code = models.CharField(max_length=10, unique=True, null=True, blank=True)
    language = models.CharField(max_length=255, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.language


class Theme(models.Model):
    theme = models.CharField(max_length=255, unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.theme


def user_image_path(instance, filename):
    return f"user/{instance.user.phone}/{filename}"


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    img = models.ImageField(upload_to=user_image_path, blank=True, null=True)
    name = models.CharField(max_length=55, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    theme = models.ForeignKey(Theme, on_delete=models.SET_NULL, null=True)
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
    name = models.CharField(max_length=55, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True)
    language = models.ForeignKey(Language, on_delete=models.CASCADE, null=True)
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, null=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"BrokerProfile ({self.user.phone})"
