// add property form
const addPropertyForm = document.getElementById('add-property-form');
const addPropertyFormUrl = addPropertyForm.dataset.basicDetailsStoreUrl;
// property type btn
const proSelectTypeBtn = document.getElementById('proc-select-type-btn');
const proSelectedType = document.getElementById('proc-selected-type');
const proSelectedTypeId = document.getElementById('proc-selected-type-id');
// property type modal
const proSelectTypeModal = document.getElementById('proc-select-type-modal');
const proTypeSearchInput = document.getElementById('type-search');
const proTypeND = document.getElementById('pro-type-no-data');
// property name
const proName = document.getElementById('proc-name');
// property price
const proPrice = document.getElementById('proc-price');
// preferred btn
const proSelectPreferredBtn = document.getElementById('proc-select-preferred-btn');
const proSelectedPreferredNames = document.getElementById('proc-selected-preferred-names');
const proSelectedPreferredIds = document.getElementById('proc-selected-preferred-ids');
// preferred modal
const proSelectPreferredModal = document.getElementById('proc-select-preferred-modal');
const proPreferredSearchInput = document.getElementById('preferred-search');
const proPreferredND = document.getElementById('pro-preferred-no-data');
const proPreferredLabel = document.querySelectorAll('.pro-preferred-label');
const proPreferredItem = document.querySelectorAll('.pro-preferred-item');
const proPreferredItemClearBtn = document.getElementById('pro-preferred-item-clear-btn');
const proPreferredItemSaveBtn = document.getElementById('pro-preferred-item-save-btn');
// facilities btn
const proSelectFacilitiesBtn = document.getElementById('proc-select-facilities-btn');
const proSelectedFacilitiesNames = document.getElementById('proc-selected-facilities-names');
const proSelectedFacilitiesIds = document.getElementById('proc-selected-facilities-ids');
// facilities modal
const proSelectFacilitiesModal = document.getElementById('proc-select-facilities-modal');
const proFacilitiesSearchInput = document.getElementById('facilities-search');
const proFacilitiesND = document.getElementById('pro-facilities-no-data');
const proFacilitiesLabel = document.querySelectorAll('.pro-facilities-label');
const proFacilitiesItem = document.querySelectorAll('.pro-facilities-item');
const proFacilitiesItemClearBtn = document.getElementById('pro-facilities-item-clear-btn');
const proFacilitiesItemSaveBtn = document.getElementById('pro-facilities-item-save-btn');
// property phone number 1
const proCountryCode1 = document.getElementById('proc-country-code1');
const proPhoneNumber1 = document.getElementById('proc-phone-number1');
const proPhone2BoxCheck = document.getElementById('proc-phone2-box-check');
// property phone number 2
const proCountryCode2Box = document.getElementById('proc-country-code2-select-box');
const proCountryCode2 = document.getElementById('proc-country-code2');
const proPhoneNumber2 = document.getElementById('proc-phone-number2');
// basic detailes btn
const basicDetailsBtn = document.getElementById('property-basic-details-btn');

proSelectTypeBtn.addEventListener('click', () => {
  pbody.classList.add('overflow-hidden', 'scrollbar-hide');
  proSelectTypeModal.classList.replace('hidden', 'flex');
  proTypeND.classList.add('hidden');
});

function typeModalClose() {
  let typeidvalue = proSelectedTypeId.value.trim();
  document.getElementById('proc-type-error').innerText = typeidvalue.length === 0 ? window.fieldProTypeEr.required : '';
  pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
  proSelectTypeModal.classList.replace('flex', 'hidden');
}

proSelectTypeModal.addEventListener('click', (e) => {
  if (e.target === proSelectTypeModal) typeModalClose();
});

function proTypeSelected(id, name) {
  proSelectedTypeId.value = id;
  proSelectedType.innerText = name;
  typeModalClose();
}

proTypeSearchInput.addEventListener('input', () => {
  const type_value = proTypeSearchInput.value.trim().toLowerCase();
  let type_found = false;

  document.querySelectorAll('.pro-type-item').forEach((item) => {
    const type_name = item.getAttribute('data-type-name').toLowerCase();
    const type_match = type_name.includes(type_value);
    item.classList.toggle('hidden', !type_match);
    if (type_match) type_found = true;
  });
  proTypeND.classList.toggle('hidden', type_found);
});

proName.addEventListener('input', function () {
  let pro_name = this.value.trim();
  document.getElementById('proc-name-error').innerText = pro_name.length === 0 ? window.fieldProNameEr.required : '';
});

proPrice.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
  let pro_price = this.value.trim();
  document.getElementById('proc-price-error').innerText = pro_price <= 0 ? window.fieldProPriceEr.required : '';
});

proSelectPreferredBtn.addEventListener('click', () => {
  pbody.classList.add('overflow-hidden', 'scrollbar-hide');
  proSelectPreferredModal.classList.replace('hidden', 'flex');
  proPreferredND.classList.add('hidden');
});

function preferredModalClose() {
  pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
  proSelectPreferredModal.classList.replace('flex', 'hidden');
}

proSelectPreferredModal.addEventListener('click', (e) => {
  if (e.target === proSelectPreferredModal) preferredModalClose();
});

proPreferredSearchInput.addEventListener('input', () => {
  const preferred_value = proPreferredSearchInput.value.trim().toLowerCase();
  let preferred_found = false;
  proPreferredLabel.forEach((label) => {
    const preferred_name = label.getAttribute('data-preferred-label-name').toLowerCase();
    const preferred_match = preferred_name.includes(preferred_value);

    label.classList.toggle('hidden', !preferred_match);
    if (preferred_match) preferred_found = true;
  });
  proPreferredND.classList.toggle('hidden', preferred_found);
});

proPreferredItemClearBtn.addEventListener('click', () => {
  document.querySelectorAll('.pro-preferred-item:checked').forEach((item) => {
    item.checked = false;
  });
  savePreferred();
});

function savePreferred() {
  const checkedPreferredItem = document.querySelectorAll('.pro-preferred-item:checked');
  const selectedPreferredItemNames = [];
  const selectedPreferredItemIds = [];

  checkedPreferredItem.forEach((item) => {
    selectedPreferredItemNames.push(item.getAttribute('data-preferred-name').toLowerCase());
    selectedPreferredItemIds.push(item.value);
  });

  if (checkedPreferredItem.length > 0) {
    proSelectedPreferredNames.innerText = proSelectedPreferredNames.dataset.propertyPreferred;
    proSelectedPreferredIds.value = null;
  } else {
    proSelectedPreferredNames.innerText = proSelectedPreferredNames.dataset.propertyPreferred;
    proSelectedPreferredIds.value = null;
  }

  proPreferredItemSaveBtn.addEventListener('click', function () {
    if (checkedPreferredItem.length > 0) {
      proSelectedPreferredNames.innerText = selectedPreferredItemNames.join(', ');
      proSelectedPreferredIds.value = selectedPreferredItemIds;
    } else {
      proSelectedPreferredNames.innerText = proSelectedPreferredNames.dataset.propertyPreferred;
      proSelectedPreferredIds.value = null;
    }
    preferredModalClose();
  });
}

proPreferredItem.forEach((item) => {
  item.addEventListener('change', savePreferred);
});
savePreferred();

proSelectFacilitiesBtn.addEventListener('click', () => {
  pbody.classList.add('overflow-hidden', 'scrollbar-hide');
  proSelectFacilitiesModal.classList.replace('hidden', 'flex');
  proFacilitiesND.classList.add('hidden');
});

function facilitiesModalClose() {
  pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
  proSelectFacilitiesModal.classList.replace('flex', 'hidden');
}

proSelectFacilitiesModal.addEventListener('click', (e) => {
  if (e.target === proSelectFacilitiesModal) facilitiesModalClose();
});

proFacilitiesSearchInput.addEventListener('input', () => {
  const facilities_value = proFacilitiesSearchInput.value.trim().toLowerCase();
  let facilities_found = false;
  proFacilitiesLabel.forEach((label) => {
    const facilities_name = label.getAttribute('data-facilities-label-name').toLowerCase();
    const facilities_match = facilities_name.includes(facilities_value);

    label.classList.toggle('hidden', !facilities_match);
    if (facilities_match) facilities_found = true;
  });
  proFacilitiesND.classList.toggle('hidden', facilities_found);
});

proFacilitiesItemClearBtn.addEventListener('click', () => {
  document.querySelectorAll('.pro-facilities-item:checked').forEach((item) => {
    item.checked = false;
  });
  saveFacilities();
});

function saveFacilities() {
  const checkedFacilitiesItem = document.querySelectorAll('.pro-facilities-item:checked');
  const selectedFacilitiesItemNames = [];
  const selectedFacilitiesItemIds = [];

  checkedFacilitiesItem.forEach((item) => {
    selectedFacilitiesItemNames.push(item.getAttribute('data-facilities-name').toLowerCase());
    selectedFacilitiesItemIds.push(item.value);
  });

  if (checkedFacilitiesItem.length > 0) {
    proSelectedFacilitiesNames.innerText = proSelectedFacilitiesNames.dataset.propertyFacilities;
    proSelectedFacilitiesIds.value = null;
  } else {
    proSelectedFacilitiesNames.innerText = proSelectedFacilitiesNames.dataset.propertyFacilities;
    proSelectedFacilitiesIds.value = null;
  }

  proFacilitiesItemSaveBtn.addEventListener('click', function () {
    if (checkedFacilitiesItem.length > 0) {
      proSelectedFacilitiesNames.innerText = selectedFacilitiesItemNames.join(', ');
      proSelectedFacilitiesIds.value = selectedFacilitiesItemIds;
    } else {
      proSelectedFacilitiesNames.innerText = proSelectedFacilitiesNames.dataset.propertyFacilities;
      proSelectedFacilitiesIds.value = null;
    }
    facilitiesModalClose();
  });
}

proFacilitiesItem.forEach((item) => {
  item.addEventListener('change', saveFacilities);
});
saveFacilities();

[proCountryCode1, proCountryCode2].forEach((countrycodebox) => {
  countrycodebox.disabled = true;
});

const togglePhone2 = (disabled) => {
  proPhoneNumber2.disabled = disabled;
  proCountryCode2Box.classList.toggle('text-gray-400', disabled);
  proPhoneNumber2.classList.toggle('text-gray-400', disabled);
  proPhoneNumber2.value = '';
};
togglePhone2(true);

proPhone2BoxCheck.addEventListener('change', (e) => {
  togglePhone2(!e.target.checked);
  proPhoneNumber2.focus();
});

proPhoneNumber1.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
  let pro_phone_number1 = this.value.trim();
  let pro_phone_number2 = proPhoneNumber2.value.trim();

  if (pro_phone_number1.length < 10) {
    document.getElementById('proc-phone-number1-error').innerText = window.fieldProPhNumEr.min10Digit;
  } else if (pro_phone_number1 === pro_phone_number2) {
    document.getElementById('proc-phone-number1-error').innerText = window.fieldProPhNumEr.uniquePn;
  } else {
    document.getElementById('proc-phone-number1-error').innerText = '';
  }
});

proPhoneNumber2.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
  let pro_phone_number1 = proPhoneNumber1.value.trim();
  let pro_phone_number2 = this.value.trim();

  if (pro_phone_number2.length < 10) {
    document.getElementById('proc-phone-number2-error').innerText = window.fieldProPhNumEr.min10Digit;
  } else if (pro_phone_number2 === pro_phone_number1) {
    document.getElementById('proc-phone-number2-error').innerText = window.fieldProPhNumEr.uniquePn;
  } else {
    document.getElementById('proc-phone-number2-error').innerText = '';
  }
});

function basicFormClear() {
  addPropertyForm.reset();
  togglePhone2(true);
  proSelectedType.innerText = proSelectedType.dataset.propertyType;
  proSelectedTypeId.value = null;
  proSelectedPreferredNames.innerText = proSelectedPreferredNames.dataset.propertyPreferred;
  proSelectedPreferredIds.value = null;
  proSelectedFacilitiesNames.innerText = proSelectedFacilitiesNames.dataset.propertyFacilities;
  proSelectedFacilitiesIds.value = null;
  document.querySelectorAll('.mess-error').forEach((el) => (el.innerText = ''));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

addPropertyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let isValid = true;
  let numList = [];

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

  const proTypeId = document.getElementById('proc-selected-type-id').value.trim();
  const proName = document.getElementById('proc-name').value.trim();
  const proPrice = document.getElementById('proc-price').value.trim();
  const proPricePeriod = document.getElementById('proc-price-type').value.trim();
  const proBhkType = document.getElementById('proc-bhk-type').value.trim();

  const proPurposeElement = document.querySelector('input[name="purpose"]:checked');
  const proPurpose = proPurposeElement ? proPurposeElement.value : '';

  const proPreferredFor = document.getElementById('proc-selected-preferred-ids').value.trim();
  const proFacilities = document.getElementById('proc-selected-facilities-ids').value.trim();

  const proP1CounCode = document.getElementById('proc-country-code1').value.trim();
  const proP1Number = document.getElementById('proc-phone-number1').value.trim();

  const proP2CounCode = document.getElementById('proc-country-code2').value.trim();
  const proP2Number = document.getElementById('proc-phone-number2').value.trim();

  const proDescription = document.getElementById('proc-description').value.trim();

  validFormField(proTypeId, 'proc-type-error', window.fieldProTypeEr.required);
  validFormField(proName, 'proc-name-error', window.fieldProNameEr.required);
  validFormField(proPrice, 'proc-price-error', window.fieldProPriceEr.required);
  validFormField(proP1Number, 'proc-phone-number1-error', window.fieldProPhNumEr.required);

  if (!isValid) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (proP1Number) {
    numList.push(`${proP1CounCode}${proP1Number}`);
  }

  if (proP2Number) {
    numList.push(`${proP2CounCode}${proP2Number}`);
  }

  if (numList.length === 0) {
    document.getElementById('proc-phone-number1-error').innerText = window.fieldProPhNumEr.required;
    return;
  }
  const uniqueNumbersSet = [...new Set(numList)];
  if (uniqueNumbersSet.length !== numList.length) {
    document.getElementById('proc-phone-number2-error').innerText = window.fieldProPhNumEr.uniquePn;
    return;
  }

  numList = uniqueNumbersSet;

  const fd = new FormData(addPropertyForm);

  fd.append('protypeid', proTypeId);
  fd.append('proname', proName);
  fd.append('proprice', proPrice);
  fd.append('propriceperiod', proPricePeriod);
  fd.append('probhktype', proBhkType);
  fd.append('propurpose', proPurpose);
  fd.append('propreferredfor', proPreferredFor);
  fd.append('profacilities', proFacilities);
  fd.append('procontact', JSON.stringify(numList));
  fd.append('prodescription', proDescription);

  try {
    const response = await fetch(addPropertyFormUrl, {
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
      const stepEl = document.getElementById('step-0');
      if (stepEl) {
        if (data.stepcomplete) stepEl.classList.add(data.stepcomplete);
        stepEl.innerHTML = `<svg xmlns="{% static 'icons/check.svg' %}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check text-white"><path d="M20 6 9 17l-5-5"/></svg>`;
      }
      const stepNameEl = document.getElementById('step-0-name');
      if (stepNameEl && data.stepcomplete) {
        stepNameEl.classList.add(data.stepcomplete);
      }

      const stepCompleteEl = document.getElementById('step-0-complete');
      if (stepCompleteEl) {
        stepCompleteEl.classList.replace('bg-red-300/30', 'bg-[#ff6b00]');
      }
      isPropertyCreated = true;
      nextStep();
      if (typeof initMap === 'function') {
        initMap();
      }
    }
  } catch (error) {
    console.log(error);
    alert(window.allError?.tryAgain);
  }
});
