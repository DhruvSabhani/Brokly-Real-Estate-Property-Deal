document.addEventListener('DOMContentLoaded', () => {
  // active listing btn
  const disabledBtnListing = document.querySelectorAll('.disabled-btn-listing');
  // disabled listing btn
  const activeBtnListing = document.querySelectorAll('.active-btn-listing');

  const deleteBtnListing = document.querySelectorAll('.delete-btn-listing');

  // property photo loader
  function initPropertyPhotoLoader() {
    document.querySelectorAll('.property-photo').forEach((img) => {
      const loader = img.closest('.relative')?.querySelector('.property-photo-loader');
      if (!loader) return;
      const showPhoto = () => {
        img.classList.remove('opacity-0');
        img.classList.add('opacity-100');
        loader.classList.remove('flex');
        loader.classList.add('hidden');
      };
      const showLoader = () => {
        img.classList.remove('opacity-100');
        img.classList.add('opacity-0');
        loader.classList.remove('hidden');
        loader.classList.add('flex');
      };
      if (img.complete) {
        img.naturalWidth > 0 ? showPhoto() : showLoader();
      } else {
        showLoader();
      }
      img.addEventListener('load', showPhoto, {
        once: true,
      });
      img.addEventListener(
        'error',
        () => {
          loader.classList.remove('flex');
          loader.classList.add('hidden');
          img.classList.remove('opacity-0');
          img.classList.add('opacity-100');
        },
        {
          once: true,
        }
      );
    });
  }
  initPropertyPhotoLoader();

  // property active ==> disabled
  if (disabledBtnListing) {
    disabledBtnListing.forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        propertyId = btn.getAttribute('data-id');
        propertyCard = btn.closest('.property-listings');
        try {
          const response = await fetch(`/portal/property/disabled/${propertyId}/`, {
            method: 'POST',
            headers: {
              'X-CSRFToken': getCSRF(),
              'X-Requested-With': 'XMLHttpRequest',
            },
          });
          const data = await response.json();
          if (!response.ok || data.error) {
            alert(data.message);
            return;
          }
          if (data.success) {
            propertyCard.style.transition = 'all 0.3s ease';
            propertyCard.style.opacity = '0';
            propertyCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
              propertyCard.remove();
            }, 300);
            if (data.redirect_url) {
              window.location.replace(data.redirect_url);
            } else {
              window.location.replace('/portal/property/disabled-listings/');
            }
          }
        } catch (error) {
          console.log(error);
          alert(window.allError.tryAgain);
        }
      });
    });
  }
  // property disabled ==> active
  if (activeBtnListing) {
    activeBtnListing.forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        propertyId = btn.getAttribute('data-id');
        propertyCard = btn.closest('.property-listings');
        try {
          const response = await fetch(`/portal/property/active/${propertyId}/`, {
            method: 'POST',
            headers: {
              'X-CSRFToken': getCSRF(),
              'X-Requested-With': 'XMLHttpRequest',
            },
          });
          const data = await response.json();
          if (!response.ok || data.error) {
            alert(data.message);
            return;
          }
          if (data.success) {
            propertyCard.style.transition = 'all 0.3s ease';
            propertyCard.style.opacity = '0';
            propertyCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
              propertyCard.remove();
            }, 300);
            if (data.redirect_url) {
              window.location.replace(data.redirect_url);
            } else {
              window.location.replace('/portal/property/active-listings/');
            }
          }
        } catch (error) {
          console.log(error);
          alert(window.allError.tryAgain);
        }
      });
    });
  }

  // property delete
  if (deleteBtnListing) {
    deleteBtnListing.forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        const propertyId = btn.getAttribute('data-id');
        const propertyCard = btn.closest('.property-listings');
        try {
          const response = await fetch(`/portal/property/delete/${propertyId}/`, {
            method: 'POST',
            headers: {
              'X-CSRFToken': getCSRF(),
              'X-Requested-With': 'XMLHttpRequest',
            },
          });
          const data = await response.json();
          if (!response.ok || data.error) {
            alert(data.message);
            return;
          }
          if (data.success) {
            propertyCard.style.transition = 'all 0.3s ease';
            propertyCard.style.opacity = '0';
            propertyCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
              propertyCard.remove();
            }, 300);
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
          alert(window.allError.tryAgain);
        }
      });
    });
  }
});
