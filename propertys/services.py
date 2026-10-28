from django.db.models import Prefetch
from propertys.models import Property, PropertyLocation, PropertyPhoto


def user_property_listings():
    pro_active = (
        Property.objects.filter(is_active=True)
        .select_related("type")
        .prefetch_related(
            Prefetch(
                "photos",
                queryset=PropertyPhoto.objects.filter(is_active=True).order_by(
                    "display_order"
                ),
                to_attr="prefetched_photos",
            )
        )
        .order_by("-create_at")
    )

    serialized_active_pro = []
    for pro in pro_active:
        pro_type = pro.type.translated_type_name() if pro.type else ""
        pro_name = pro.property_name
        all_photos = list(getattr(pro, "prefetched_photos", []))
        first_photo = all_photos[0] if all_photos else None
        cover_photo_url = (
            first_photo.image.url
            if first_photo and first_photo.image
            else "/static/images/property-default-img.png"
        )
        pro_bhk_type = pro.get_property_bhk_type_display()
        pro_purpose = pro.get_property_purpose_display()
        pro_price = pro.formatted_property_price()
        pro_time_period = pro.get_property_price_period_display()
        pro_location = getattr(pro, "location", None)
        location_text = pro_location.property_full_address() if pro_location else ""

        serialized_active_pro.append(
            {
                "id": pro.pk,
                "cover_photo": cover_photo_url,
                "type": pro_type,
                "name": pro_name,
                "bhk_type": pro_bhk_type,
                "purpose": pro_purpose,
                "price": pro_price,
                "time_period": pro_time_period,
                "phone": pro.property_contact,
                "location": location_text,
            }
        )
    return serialized_active_pro
