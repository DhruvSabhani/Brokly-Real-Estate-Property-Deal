from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import CustomUser, UserProfile, PortalProfile
from common.models import ProfileAddresses


@receiver(post_save, sender=CustomUser)
def create_profiles(sender, instance, created, **kwargs):
    if created:
        if instance.is_user:
            UserProfile.objects.create(user=instance)
            ProfileAddresses.objects.create(profile_role=instance)

        elif instance.is_portal:
            PortalProfile.objects.create(user=instance)
            ProfileAddresses.objects.create(profile_role=instance)
