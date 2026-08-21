// add property location form
const addLocationForm = document.getElementById('add-property-location-form');
const addLocationFormUrl = addLocationForm.dataset.propertyLocationStoreUrl;
// property country btn
const proSelectContryBtn = document.getElementById('proc-select-country-btn');
const proSelectedCountry = document.getElementById('proc-selected-country');
if (proSelectedCountry) {
  const countryData = proSelectedCountry.dataset.selectedCountry;
  proSelectedCountry.innerText = countryData ? countryData : window.countryEr?.selectCountry;
}
const proSelectedCountryId = document.getElementById('proc-selected-country-id');
// property country modal
const proSelectCountryModal = document.getElementById('proc-select-country-modal');
const proCountrySearchInput = document.getElementById('country-search');
const proCountryND = document.getElementById('pro-country-no-data');
// property state btn
const proSelectStateBtn = document.getElementById('proc-select-state-btn');
const proSelectedState = document.getElementById('proc-selected-state');
const proSelectedStateId = document.getElementById('proc-selected-state-id');
proSelectedStateId.value.length === 0
  ? (document.getElementById('proc-select-city-btn').disabled = true)
  : (document.getElementById('proc-select-city-btn').disabled = false);
// property state modal
const proSelectStateModal = document.getElementById('proc-select-state-modal');
const proStateSearchInput = document.getElementById('state-search');
const proStateList = document.getElementById('pro-state-list');
const proStateND = document.getElementById('pro-state-no-data');
// property city btn
const proSelectCityBtn = document.getElementById('proc-select-city-btn');
const proSelectedCity = document.getElementById('proc-selected-city');
if (proSelectedCity) {
  const cityData = proSelectedCity.dataset.selectedCity;
  proSelectedCity.innerText = cityData ? cityData : window.cityEr?.selectCity;
}
const proSelectedCityId = document.getElementById('proc-selected-city-id');
// property city modal
const proSelectCityModal = document.getElementById('proc-select-city-modal');
const proCitySearchInput = document.getElementById('city-search');
const proCityList = document.getElementById('pro-city-list');
const proCityND = document.getElementById('pro-city-no-data');
// state
if (proSelectedState) {
  const stateData = proSelectedState.dataset.selectedState;
  // proSelectedState.innerText = stateData ? stateData : window.stateEr?.selectState;
  proSelectedState.innerText = stateData || window.stateEr?.selectState;
  proSelectCityBtn.disabled = !stateData;
}
// property name
const proArea = document.getElementById('proc-area');
// property landmark
const proLandmark = document.getElementById('proc-landmark');
// property pincode
const proPincode = document.getElementById('proc-pincode');
// property address line
const proAddressLine = document.getElementById('proc-address-line');
// property map, latitude and longitude
let map;
let marker;
let geocoder;
let autocomplete;
// location detailes btn
const locationDetailsBtn = document.getElementById('property-location-details-btn');

//-----------------------------------------------------------------------------------------

proSelectContryBtn.addEventListener('click', () => {
  pbody.classList.add('overflow-hidden', 'scrollbar-hide');
  proSelectCountryModal.classList.replace('hidden', 'flex');
  proCountryND.classList.add('hidden');
});

function countryModalClose() {
  let countryidvalue = proSelectedCountryId.value.trim();
  document.getElementById('proc-country-error').innerText =
    countryidvalue.length === 0 ? window.countryEr.required : '';
  pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
  proSelectCountryModal.classList.replace('flex', 'hidden');
}

proSelectCountryModal.addEventListener('click', (e) => {
  if (e.target === proSelectCountryModal) countryModalClose();
});

function proCountrySelected(id, name, latitude, longitude) {
  proSelectedCountryId.value = id;
  proSelectedCountry.innerText = name;
  document.getElementById('proc-selected-country-id').dataset.countryLat = latitude;
  document.getElementById('proc-selected-country-id').dataset.countryLng = longitude;
  document.getElementById('proc-selected-state-id').dataset.stateLat = '';
  document.getElementById('proc-selected-state-id').dataset.stateLng = '';
  document.getElementById('proc-selected-city-id').dataset.cityLat = '';
  document.getElementById('proc-selected-city-id').dataset.cityLng = '';
  document.getElementById('proc-selected-state').innerText = window.stateEr.selectState;
  document.getElementById('proc-selected-state-id').value = '';
  document.getElementById('proc-selected-city').innerText = window.cityEr.selectCity;
  document.getElementById('proc-selected-city-id').value = '';
  proSelectCityBtn.disabled = true;
  countryModalClose();
  initMap();
}

proCountrySearchInput.addEventListener('input', () => {
  const country_value = proCountrySearchInput.value.trim().toLowerCase();
  let country_found = false;

  document.querySelectorAll('.pro-country-item').forEach((item) => {
    const country_name = item.getAttribute('data-country-name').toLowerCase();
    const country_match = country_name.includes(country_value);
    item.classList.toggle('hidden', !country_match);
    if (country_match) country_found = true;
  });
  proCountryND.classList.toggle('hidden', country_found);
});

proSelectStateBtn.addEventListener('click', () => {
  pbody.classList.add('overflow-hidden', 'scrollbar-hide');
  proSelectStateModal.classList.replace('hidden', 'flex');
  proStateND.classList.add('hidden');

  const pro_country_id = document.getElementById('proc-selected-country-id').value;
  fetch(`/portal/get/states/?pro_country_id=${pro_country_id}`)
    .then((res) => res.json())
    .then(({ states }) => {
      if (!states.length) {
        proStateList.innerHTML = '';
        proStateND.classList.remove('hidden');
        return;
      }
      proStateND.classList.add('hidden');
      const statehtml = states
        .map((s) => {
          const stateName = currentLanguage === 'gu' ? s.state_name_gu : s.name;
          return `<div title="${stateName}" class="pro-state-item w-full flex justify-center items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-orange-50 dark:hover:bg-[#1F2937] text-black/60 dark:text-white/70 border border-black/15 dark:border-white/15 transition-all duration-200" data-state-name="${stateName}" onclick="proStateSelected('${s.id}','${stateName}','${s.latitude}','${s.longitude}')"><span class="text-[17px]">${stateName}</span></div>`;
        })
        .join('');
      proStateList.innerHTML = statehtml;
    })
    .catch(console.error);
});

function stateModalClose() {
  let stateidvalue = proSelectedStateId.value.trim();
  document.getElementById('proc-state-error').innerText = stateidvalue.length === 0 ? window.stateEr.required : '';
  pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
  proSelectStateModal.classList.replace('flex', 'hidden');
}

proSelectStateModal.addEventListener('click', (e) => {
  if (e.target === proSelectStateModal) stateModalClose();
});

function proStateSelected(id, name, latitude, longitude) {
  proSelectedStateId.value = id;
  proSelectedState.innerText = name;
  document.getElementById('proc-selected-state-id').dataset.stateLat = latitude;
  document.getElementById('proc-selected-state-id').dataset.stateLng = longitude;
  document.getElementById('proc-selected-city-id').dataset.cityLat = '';
  document.getElementById('proc-selected-city-id').dataset.cityLng = '';
  document.getElementById('proc-selected-city').innerText = window.cityEr.selectCity;
  document.getElementById('proc-selected-city-id').value = '';
  proSelectCityBtn.disabled = false;
  stateModalClose();
  initMap();
}

proStateSearchInput.addEventListener('input', () => {
  const state_value = proStateSearchInput.value.trim().toLowerCase();
  let state_found = false;

  document.querySelectorAll('.pro-state-item').forEach((item) => {
    const state_name = item.getAttribute('data-state-name').toLowerCase();
    const state_match = state_name.includes(state_value);
    item.classList.toggle('hidden', !state_match);
    if (state_match) state_found = true;
  });
  proStateND.classList.toggle('hidden', state_found);
});

proSelectCityBtn.addEventListener('click', () => {
  pbody.classList.add('overflow-hidden', 'scrollbar-hide');
  proSelectCityModal.classList.replace('hidden', 'flex');
  proCityND.classList.add('hidden');

  const pro_state_id = document.getElementById('proc-selected-state-id').value;
  fetch(`/portal/get/cities/?pro_state_id=${pro_state_id}`)
    .then((res) => res.json())
    .then(({ cities }) => {
      if (!cities.length) {
        proCityList.innerHTML = '';
        proCityND.classList.remove('hidden');
        return;
      }
      proCityND.classList.add('hidden');
      const cityhtml = cities
        .map((c) => {
          const cityName = currentLanguage === 'gu' ? c.city_name_gu : c.name;
          return `<div title="${cityName}" class="pro-city-item w-full flex justify-center items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-orange-50 dark:hover:bg-[#1F2937] text-black/60 dark:text-white/70 border border-black/15 dark:border-white/15 transition-all duration-200" data-city-name="${cityName}" onclick="proCitySelected('${c.id}','${cityName}','${c.latitude}','${c.longitude}')"><span class="text-[17px]">${cityName}</span></div>`;
        })
        .join('');
      proCityList.innerHTML = cityhtml;
    })
    .catch(console.error);
});

function cityModalClose() {
  let cityidvalue = proSelectedCityId.value.trim();
  document.getElementById('proc-city-error').innerText = cityidvalue.length === 0 ? window.cityEr.required : '';
  pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
  proSelectCityModal.classList.replace('flex', 'hidden');
}

proSelectCityModal.addEventListener('click', (e) => {
  if (e.target === proSelectCityModal) cityModalClose();
});

function proCitySelected(id, name, latitude, longitude) {
  proSelectedCityId.value = id;
  proSelectedCity.innerText = name;
  document.getElementById('proc-selected-city-id').dataset.cityLat = latitude;
  document.getElementById('proc-selected-city-id').dataset.cityLng = longitude;
  cityModalClose();
  initMap();
}

proCitySearchInput.addEventListener('input', () => {
  const city_value = proCitySearchInput.value.trim().toLowerCase();
  let city_found = false;

  document.querySelectorAll('.pro-city-item').forEach((item) => {
    const city_name = item.getAttribute('data-city-name').toLowerCase();
    const city_match = city_name.includes(city_value);
    item.classList.toggle('hidden', !city_match);
    if (city_match) city_found = true;
  });
  proCityND.classList.toggle('hidden', city_found);
});

proArea.addEventListener('input', function () {
  let pro_area = this.value.trim();
  document.getElementById('proc-area-error').innerText = pro_area.length === 0 ? window.fieldProAreaEr.required : '';
});

proLandmark.addEventListener('input', function () {
  let pro_landmark = this.value.trim();
  document.getElementById('proc-landmark-error').innerText =
    pro_landmark.length === 0 ? window.fieldProLandmarkEr.required : '';
});

proPincode.addEventListener('input', function () {
  let pro_pincode = this.value.trim();
  document.getElementById('proc-pincode-error').innerText =
    pro_pincode.length === 0 ? window.fieldProPinEr.required : '';
});

proAddressLine.addEventListener('input', function () {
  let pro_address_line = this.value.trim();
  document.getElementById('proc-address-line-error').innerText =
    pro_address_line.length === 0 ? window.fieldProAddressLineEr.required : '';
});

function initMap() {
  // default location country-india
  const cityElement = document.getElementById('proc-selected-city-id');
  const stateElement = document.getElementById('proc-selected-state-id');
  const countryElement = document.getElementById('proc-selected-country-id');
  let zoomLevel = 4; // Default zoom level
  let defaultLocation = { lat: 0, lng: 0 }; // Default to (0, 0) if no location is selected

  if (cityElement && cityElement.value !== '' && cityElement.value !== null) {
    defaultLocation = {
      lat: parseFloat(cityElement.dataset.cityLat ?? 0),
      lng: parseFloat(cityElement.dataset.cityLng ?? 0),
    };
    zoomLevel = 10; // Increase zoom level for city-specific view
  } else if (stateElement && stateElement.value !== '' && stateElement.value !== null) {
    defaultLocation = {
      lat: parseFloat(stateElement.dataset.stateLat ?? 0),
      lng: parseFloat(stateElement.dataset.stateLng ?? 0),
    };
    zoomLevel = 6; // Moderate zoom level for state-specific view
  } else {
    defaultLocation = {
      lat: parseFloat(countryElement.dataset.countryLat ?? 0),
      lng: parseFloat(countryElement.dataset.countryLng ?? 0),
    };
  }

  map = new google.maps.Map(document.getElementById('proc-map'), {
    center: defaultLocation,
    zoom: zoomLevel,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    scaleControl: true,
  });

  geocoder = new google.maps.Geocoder();

  marker = new google.maps.Marker({
    position: defaultLocation,
    center: defaultLocation,
    map: map,
    draggable: true,
  });

  updateLatLng(defaultLocation);

  map.addListener('click', function (event) {
    const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    map.setCenter(location);
    marker.setPosition(location);
    moveMarker(location);
  });

  // drag marker
  marker.addListener('dragend', function (event) {
    const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    updateLatLng(location);
  });
}

function moveMarker(location) {
  map.setCenter(location);
  marker.setPosition(location);
  updateLatLng(location);
}

// lat and lng value change
function updateLatLng(location) {
  const locationLat = !location || isNaN(location.lat) ? 0 : location.lat.toFixed(7);
  const locationLng = !location || isNaN(location.lng) ? 0 : location.lng.toFixed(7);
  document.getElementById('proc-latitude').value = locationLat;
  document.getElementById('proc-longitude').value = locationLng;
}

function updateAutoMap(lat, lng) {
  const location = { lat: parseFloat(lat), lng: parseFloat(lng) };
  moveMarker(location);
}

function locationFormClear() {
  addLocationForm.reset();
  document.getElementById('proc-selected-state').innerText = window.stateEr.selectState;
  document.getElementById('proc-selected-state-id').value = null;
  document.getElementById('proc-selected-state-id').dataset.stateLat = '';
  document.getElementById('proc-selected-state-id').dataset.stateLng = '';
  document.getElementById('proc-selected-city').innerText = window.cityEr.selectCity;
  document.getElementById('proc-selected-city-id').value = null;
  document.getElementById('proc-selected-city-id').dataset.cityLat = '';
  document.getElementById('proc-selected-city-id').dataset.cityLng = '';
  proSelectCityBtn.disabled = true;
  document.querySelectorAll('.mess-error').forEach((el) => (el.innerText = ''));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  initMap();
}

addLocationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let isValid = true;

  const validFormField = (elementId, errorElementId, errorMessage) => {
    const validField = document.getElementById(errorElementId);
    if (validField) {
      validField.innerText = '';
    }
    if (!elementId) {
      isValid = false;
      if (validField) {
        validField.innerText = errorMessage;
      }
    }
  };

  const proCountryId = document.getElementById('proc-selected-country-id').value.trim();
  const proStateId = document.getElementById('proc-selected-state-id').value.trim();
  const proCityId = document.getElementById('proc-selected-city-id').value.trim();
  const proArea = document.getElementById('proc-area').value.trim();
  const proLandmark = document.getElementById('proc-landmark').value.trim();
  const proPincode = document.getElementById('proc-pincode').value.trim();
  const proAddressLine = document.getElementById('proc-address-line').value.trim();
  const proLatitude = document.getElementById('proc-latitude').value.trim();
  const proLongitude = document.getElementById('proc-longitude').value.trim();

  validFormField(proCountryId, 'proc-country-error', window.countryEr.required);
  validFormField(proStateId, 'proc-state-error', window.stateEr.required);
  validFormField(proCityId, 'proc-city-error', window.cityEr.required);
  validFormField(proArea, 'proc-area-error', window.fieldProAreaEr.required);
  validFormField(proPincode, 'proc-pincode-error', window.fieldProPinEr.required);
  validFormField(proAddressLine, 'proc-address-line-error', window.fieldProAddressLineEr.required);

  if (!isValid) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const fd = new FormData(addLocationForm);
  fd.append('procountryid', proCountryId);
  fd.append('prostateid', proStateId);
  fd.append('procityid', proCityId);
  fd.append('proarea', proArea);
  fd.append('prolandmark', proLandmark);
  fd.append('propincode', proPincode);
  fd.append('proaddressline', proAddressLine);
  fd.append('prolatitude', proLatitude);
  fd.append('prolongitude', proLongitude);

  try {
    const response = await fetch(addLocationFormUrl, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCSRF(),
      },
      body: fd,
    });

    const data = await response.json();
    if (data.error) {
      alert(data.message);
      return;
    }
    if (data.success) {
      const step1El = document.getElementById('step-1');
      if (step1El) {
        if (data.stepcomplete) step1El.classList.add(data.stepcomplete);
        step1El.innerHTML = `<svg xmlns="{% static 'icons/check.svg' %}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check text-white"><path d="M20 6 9 17l-5-5"/></svg>`;
      }
      const step1NameEl = document.getElementById('step-1-name');
      if (step1NameEl && data.stepcomplete) {
        step1NameEl.classList.add(data.stepcomplete);
      }
      const step1CompleteEl = document.getElementById('step-1-complete');
      if (step1CompleteEl) {
        step1CompleteEl.classList.replace('bg-red-300/30', 'bg-[#ff6b00]');
      }
      isPropertyCreated = true;
      nextStep();
    }
  } catch (error) {
    console.log(error);
    alert(window.allError.tryAgain);
  }
});
