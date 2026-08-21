const reviewStepsConfig = [
  { id: 'proc-basic-details-btn', step: 0 },
  { id: 'proc-location-btn', step: 1 },
  { id: 'proc-photos-btn', step: 2 },
];
// cancel btn
const propertyCancelBtn = document.getElementById('property-cancel-btn');
// publish btn
const propertyPublishBtn = document.getElementById('property-publish-btn');
const loaderPublishBtn = document.getElementById('loader-publish-btn');
loaderPublishBtn.classList.remove('flex', 'opacity-100', 'scale-100');
loaderPublishBtn.classList.add('hidden', 'opacity-0', 'scale-0');

function capitalizeFirst(value) {
  if (!value) return '-';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderProprtyReview(data) {
  const property = data.property;
  const location = data.location;
  const photos = data.photos;

  document.getElementById('proc-property-type-value').innerText = capitalizeFirst(property.type);
  document.getElementById('proc-property-name-value').innerText = capitalizeFirst(property.name);
  document.getElementById('proc-property-price-value').innerText = property.price ? '₹ ' + property.price : '-';
  document.getElementById('proc-property-price-period-value').innerText = capitalizeFirst(property.price_period);
  document.getElementById('proc-property-bhk-value').innerText = capitalizeFirst(property.bhk_type);
  document.getElementById('proc-property-purpose-value').innerText = capitalizeFirst(property.purpose);
  const constactsHtml = property.contacts.map((contact) => `<p>${contact}</p>`).join('');
  document.getElementById('proc-property-contact-value').innerHTML = constactsHtml || '-';
  document.getElementById('proc-property-description-value').innerText = capitalizeFirst(property.description);
  document.getElementById('proc-property-preferred-value').innerText =
    property.preferred_for?.map((item) => item.name).join(', ') || '-';
  document.getElementById('proc-property-facilities-value').innerText =
    property.facilities?.map((item) => item.name).join(', ') || '-';

  document.getElementById('proc-property-address-value').innerText = location.full_address || '-';

  const photosArray = photos || [];
  document.getElementById('proc-count-photo-value').innerHTML = photosArray.length > 0 ? `(${photosArray.length})` : '';
  if (photosArray.length > 0) {
    const photosHtml = photosArray
      .map((photo) => {
        return `
        <div class="group relative overflow-hidden aspect-[3/2] bg-slate-50 border border-slate-100 rounded-xl">
        <img src="${photo.url}" alt="${photo.url}" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" onerror="this.src='/static/images/placeholder.png'">
        </div>
        `;
      })
      .join('');
    document.getElementById('proc-property-photos-container').innerHTML = photosHtml;
  }
}

async function loadPropertyReview() {
  try {
    const response = await fetch('/portal/property/review/', {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const data = await response.json();
    if (!response.ok || data.error) {
      alert(data.message);
      return;
    }
    isPropertyCreated = true;
    renderProprtyReview(data);
  } catch (error) {
    console.log(error);
    alert(window.allError.tryAgain);
  }
}
// loadPropertyReview();

reviewStepsConfig.forEach(({ id, step }) => {
  const buttonElement = document.getElementById(id);
  if (buttonElement) {
    buttonElement.addEventListener('click', function (e) {
      e.preventDefault();
      showStep(step);
    });
  }
});

if (propertyCancelBtn) {
  propertyCancelBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(window.allError.cancelPropertyMess)) return;
    try {
      const response = await fetch('/portal/property/disable-list/', {
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
        isPropertyCreated = false;
        if (data.redirect_url) {
          window.location.replace(data.redirect_url);
        } else {
          window.location.replace('/portal/property/create/');
        }
      }
    } catch (error) {
      console.log(error);
      alert(window.allError.tryAgain);
    }
  });
}

if (propertyPublishBtn) {
  propertyPublishBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const showPublishLoader = () => {
      loaderPublishBtn.classList.remove('hidden', 'opacity-0', 'scale-0');
      loaderPublishBtn.classList.add('flex', 'opacity-100', 'scale-100');
    };
    const hidePublishLoader = () => {
      loaderPublishBtn.classList.remove('flex', 'opacity-100', 'scale-100');
      loaderPublishBtn.classList.add('hidden', 'opacity-0', 'scale-0');
    };
    if (!confirm(window.allError.publishPropertyMess)) return;
    showPublishLoader();
    try {
      const response = await fetch('/portal/property/active-list/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': getCSRF(),
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        alert(data.message);
        hidePublishLoader();
        return;
      }
      if (data.success) {
        hidePublishLoader();
        const step3El = document.getElementById('step-3');
        if (step3El) {
          if (data.stepcomplete) step3El.classList.add(data.stepcomplete);
          step3El.innerHTML = `<svg xmlns="{% static 'icons/check.svg' %}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check text-white"><path d="M20 6 9 17l-5-5"/></svg>`;
        }
        const step3NameEl = document.getElementById('step-3-name');
        if (step3NameEl && data.stepcomplete) {
          step3NameEl.classList.add(data.stepcomplete);
        }

        const step3CompleteEl = document.getElementById('step-3-complete');
        if (step3CompleteEl) {
          step3CompleteEl.classList.replace('bg-red-300/30', 'bg-[#ff6b00]');
        }
        isPropertyCreated = false;
        if (data.redirect_url) {
          window.location.replace(data.redirect_url);
        } else {
          window.location.replace('/portal/property/active-listings/');
        }
      }
    } catch (error) {
      console.log(error);
      alert(window.allError.tryAgain);
      if (loaderPublishBtn) {
        hidePublishLoader();
      }
    }
  });
}
