from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import CustomUser, UserProfile, BrokerProfile


@receiver(post_save, sender=CustomUser)
def create_profiles(sender, instance, created, **kwargs):
    if created:
        if instance.is_user:
            UserProfile.objects.create(user=instance)
        if instance.is_broker:
            BrokerProfile.objects.create(user=instance)
