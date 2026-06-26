from django.db import models
from accounts.models import *


# Create your models here.
class Addresses(models.Model):
    profile = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="addresses"
    )
    country = models.ForeignKey(CountryCode, on_delete=models.SET_NULL, null=True)
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True)
    area = models.CharField(max_length=150, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    latitude = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True
    )
    longitued = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    upadted_at = models.DateTimeField(auto_now=True)

    def fully_address(self):
        parts = [
            str(self.area) if self.area else None,
            str(self.city) if self.city else None,
            str(self.state) if self.state else None,
            str(self.country) if self.country else None,
        ]
        address = ", ".join([p for p in parts if p])
        if self.pincode:
            address += f" - {self.pincode}"
        return address

    def __str__(self):
        return self.fully_address()
