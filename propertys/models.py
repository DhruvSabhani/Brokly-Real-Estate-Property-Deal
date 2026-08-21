from django.db import models
from accounts.models import CountryCode, State, City, PortalProfile
from django.utils.translation import get_language, gettext_lazy as _


# Create your models here.
class PropertyType(models.Model):
    type_name = models.CharField(max_length=130, blank=True, null=True)
    type_name_gu = models.CharField(max_length=130, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        current_lang = get_language()
        if current_lang == "gu" and self.type_name_gu:
            return self.type_name_gu
        return self.type_name or ""


class PropertyPreferred(models.Model):
    preferred_name = models.CharField(max_length=130, blank=True, null=True)
    preferred_name_gu = models.CharField(max_length=130, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        current_lang = get_language()
        if current_lang == "gu" and self.preferred_name_gu:
            return self.preferred_name_gu
        return self.preferred_name or ""


class PropertyFacility(models.Model):
    facilities_name = models.CharField(max_length=130, blank=True, null=True)
    facilities_name_gu = models.CharField(max_length=130, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        current_lang = get_language()
        if current_lang == "gu" and self.facilities_name_gu:
            return self.facilities_name_gu
        return self.facilities_name or ""


class Property(models.Model):
    PRICE_PERIOD_CHOICES = [
        ("day", _("Per Day")),
        ("week", _("Per Week")),
        ("month", _("Per Month")),
        ("year", _("Per Year")),
    ]
    BHK_TYPE_CHOICES = [
        ("1rk", "1 RK/Room"),
        ("1bhk", "1 BHK"),
        ("2bhk", "2 BHK"),
        ("3bhk", "3 BHK"),
        ("4bhk", "4 BHK"),
        ("5bhk", "5 BHK"),
        ("5plusbhk", "5+ BHK"),
    ]
    PURPOSE_CHOCICES = [
        ("rent", _("For Rent")),
        ("sale", _("For Sale")),
        ("pg/hostel", _("PG/Hostel")),
    ]

    profile = models.ForeignKey(
        PortalProfile, on_delete=models.CASCADE, null=True, blank=True
    )
    type = models.ForeignKey(
        PropertyType, on_delete=models.SET_NULL, null=True, blank=True
    )
    property_name = models.CharField(max_length=500, null=True, blank=True)
    property_price = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True
    )
    property_price_period = models.CharField(
        max_length=10, choices=PRICE_PERIOD_CHOICES, default="month"
    )
    property_bhk_type = models.CharField(
        max_length=10, choices=BHK_TYPE_CHOICES, null=True, blank=True
    )
    property_purpose = models.CharField(
        max_length=10, choices=PURPOSE_CHOCICES, default="rent"
    )
    property_preferred = models.ManyToManyField(PropertyPreferred, blank=True)
    property_facilities = models.ManyToManyField(PropertyFacility, blank=True)
    property_contact = models.JSONField(default=list, blank=True)
    property_description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    @property
    def formatted_property_price(self):
        if self.property_price:
            return f"{int(self.property_price):,}"
        return "0"

    def get_property_price_period_display(self) -> str:
        value = self.property_price_period or ""
        return str(dict(self.PRICE_PERIOD_CHOICES).get(value, ""))

    def get_property_bhk_type_display(self) -> str:
        value = self.property_bhk_type or ""
        return str(dict(self.BHK_TYPE_CHOICES).get(value, ""))

    def get_property_purpose_display(self) -> str:
        value = self.property_purpose or ""
        return str(dict(self.PURPOSE_CHOCICES).get(value, ""))

    def __str__(self):
        return self.property_name or str(self.pk)


class PropertyLocation(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, null=True, blank=True
    )
    country = models.ForeignKey(
        CountryCode, on_delete=models.SET_NULL, null=True, blank=True
    )
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    area = models.CharField(max_length=150, null=True, blank=True)
    landmark = models.CharField(max_length=150, null=True, blank=True)
    address_line = models.CharField(max_length=255, null=True, blank=True)
    pincode = models.CharField(max_length=20, null=True, blank=True)
    latitude = models.DecimalField(
        max_digits=12, decimal_places=7, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=12, decimal_places=7, null=True, blank=True
    )
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def property_full_address(self):
        parts = [
            str(self.address_line) if self.address_line else None,
            str(self.landmark) if self.landmark else None,
            str(self.area) if self.area else None,
            str(self.city) if self.city else None,
            str(self.state) if self.state else None,
            str(self.country) if self.country else None,
        ]

        valid_parts = [p for p in parts if p]
        if not valid_parts:
            return ""
        valid_parts[0] = valid_parts[0].capitalize()

        property_location = ", ".join(valid_parts)
        property_location = property_location[0].upper() + property_location[1:]

        if self.pincode:
            property_location += f" - {self.pincode}"
        return property_location

    def __str__(self):
        return self.property_full_address()


class PropertyPhoto(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, null=True, blank=True
    )
    image = models.ImageField(upload_to="property/%Y/%m/%d/", null=True, blank=True)
    image_title = models.CharField(max_length=150, null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.pk)
