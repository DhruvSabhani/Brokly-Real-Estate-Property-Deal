from django.db import models


# Create your models here.
class PropertyTypes(models.Model):
    type_name = models.CharField(max_length=130, blank=True, null=True)
    type_name_gu = models.CharField(max_length=130, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.type_name


class PropertyPerferred(models.Model):
    perferred_name = models.CharField(max_length=130, blank=True, null=True)
    perferred_name_gu = models.CharField(max_length=130, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.perferred_name


class PropertyFacilities(models.Model):
    facilities_name = models.CharField(max_length=130, blank=True, null=True)
    facilities_name_gu = models.CharField(max_length=130, blank=True, null=True)
    is_active = models.BooleanField(default=False)
    update_at = models.DateTimeField(auto_now=True)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.facilities_name
