from django.db import models

# Create your models here. class PropertyType(models.Model): type_name = models.CharField(max_length=130, blank=True,
null=True) type_name_gu = models.CharField(max_length=130, blank=True, null=True) is_active =
models.BooleanField(default=False) update_at = models.DateTimeField(auto_now=True) create_at =
models.DateTimeField(auto_now_add=True)

def __str__(self): return self.type_name

class PropertyPreferred(models.Model): preferred_name = models.CharField(max_length=130, blank=True, null=True)
preferred_name_gu = models.CharField(max_length=130, blank=True, null=True) is_active =
models.BooleanField(default=False) update_at = models.DateTimeField(auto_now=True) create_at =
models.DateTimeField(auto_now_add=True)

def __str__(self): return self.preferred_name

class PropertyFacility(models.Model): facilities_name = models.CharField(max_length=130, blank=True, null=True)
facilities_name_gu = models.CharField(max_length=130, blank=True, null=True) is_active =
models.BooleanField(default=False) update_at = models.DateTimeField(auto_now=True) create_at =
models.DateTimeField(auto_now_add=True)

def __str__(self): return self.facilities_name

class Property(models.Model): PRICE_PERIOD_CHOICES = [ ("day", "Per Day"), ("week", "Per Week"), ("month", "Per Month"),
("year", "Per Year"), ]

BHK_TYPE_CHOICES = [ ("1_rk", "1 RK/Room"), ("1_bhk", "1 BHK"), ("2_bhk", "2 BHK"), ("3_bhk", "3 BHK"), ("4_bhk", "4
BHK"), ("5_bhk", "5 BHK"), ("5_plus_bhk", "5+ BHK"), ]

PURPOSE_CHOCICES = [ ("rent", "For Rent"), ("sale", "For Sale"), ("pg/hostel", "PG/Hostel"), ]

type_id = models.ForeignKey( PropertyType, on_delete=models.SET_NULL, null=True, blank=True ) property_name =
models.CharField(max_length=500, null=True, blank=True) property_price = models.DecimalField( max_digits=20,
decimal_places=2, null=True, blank=True ) property_price_period = models.CharField( max_length=10,
choices=PRICE_PERIOD_CHOICES, default="month" ) property_bhk_type = models.CharField( max_length=10,
choices=BHK_TYPE_CHOICES, null=True, blank=True ) property_purpose = models.CharField( max_length=10,
choices=PURPOSE_CHOCICES, default="rent" ) property_preferred = models.ManyToManyField(PropertyPreferred, blank=True)
property_facilities = models.ManyToManyField(PropertyFacility, blank=True) property_contact =
models.JSONField(default=list, null=True, blank=True) property_description = models.TextField(null=True, blank=True)

is_active = models.BooleanField(default=True) update_at = models.DateTimeField(auto_now=True) create_at =
models.DateTimeField(auto_now_add=True)

def __str__(self): return self.property_name or f"{self.pk}"