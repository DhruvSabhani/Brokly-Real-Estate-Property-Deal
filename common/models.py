from django.db import models
from accounts.models import *


# Create your models here.
class ProfileAddresses(models.Model):
    ROLE_TYPE = (
        ("user", "User"),
        ("portal", "Portal"),
    )
    profile_role = models.CharField(max_length=30, choices=ROLE_TYPE, default="user")
    profile_id = models.CharField(max_length=30, blank=True, null=True)
    area = models.CharField(max_length=150, blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True)
    country = models.ForeignKey(CountryCode, on_delete=models.SET_NULL, null=True)
    pincode = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(
        max_digits=12, decimal_places=7, null=True, blank=True
    )
    longitued = models.DecimalField(
        max_digits=12, decimal_places=7, null=True, blank=True
    )
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    def profile_fully_address(self):
        parts = [
            str(self.area) if self.area else None,
            str(self.city.translated_city_name()) if self.city else None,
            str(self.state.translated_state_name()) if self.state else None,
            str(self.country.translated_country_name()) if self.country else None,
        ]
        # profile_address = ", ".join([p for p in parts if p])
        # if self.pincode:
        #     profile_address += f"- {self.pincode}"

        # return profile_address

        valid_parts = [p for p in parts if p]
        if not valid_parts:
            return ""
        valid_parts[0] = valid_parts[0].capitalize()

        profile_address = ", ".join(valid_parts)
        profile_address = profile_address[0].upper() + profile_address[1:]

        if self.pincode:
            profile_address += f" - {self.pincode}"
        return profile_address

    def __str__(self):
        return self.profile_fully_address()
