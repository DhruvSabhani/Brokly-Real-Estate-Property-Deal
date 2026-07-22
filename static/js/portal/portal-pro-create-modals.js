// add property form
const addpropertyform = document.getElementById("add-property-form");
// property type btn
const proSelectTypeBtn = document.getElementById("proc-select-type-btn");
const proSelectedType = document.getElementById("proc-selected-type");
const proSelectedTypeId = document.getElementById("proc-selected-type-id");
// property type modal
const proSelectTypeModal = document.getElementById("proc-select-type-modal");
const proTypeSearchInput = document.getElementById("type-search");
const proTypeND = document.getElementById("pro-type-no-data");
// property name
const proName = document.getElementById("proc-name");
const proNameError = document.getElementById("proc-name-error");
// property price
const proPrice = document.getElementById("proc-price");
const propriceError = document.getElementById("proc-price-error");
// preferred btn
const proSelectPreferredBtn = document.getElementById("proc-select-preferred-btn");
const proSelectedPreferredNames = document.getElementById("proc-selected-preferred-names");
const proSelectedPreferredIds = document.getElementById("proc-selected-preferred-ids");
// preferred modal
const proSelectPreferredModal = document.getElementById("proc-select-preferred-modal");
const proPreferredSearchInput = document.getElementById("preferred-search");
const proPreferredND = document.getElementById("pro-preferred-no-data");
const proPreferredLabel = document.querySelectorAll(".pro-preferred-label");
const proPreferredItem = document.querySelectorAll(".pro-preferred-item");
const proPreferredItemClearBtn = document.getElementById("pro-preferred-item-clear-btn");
const proPreferredItemSaveBtn = document.getElementById("pro-preferred-item-save-btn");
// facilities btn
const proSelectFacilitiesBtn = document.getElementById("proc-select-facilities-btn");
const proSelectedFacilitiesNames = document.getElementById("proc-selected-facilities-names");
const proSelectedFacilitiesIds = document.getElementById("proc-selected-facilities-ids");
// facilities modal
const proSelectFacilitiesModal = document.getElementById("proc-select-facilities-modal");
const proFacilitiesSearchInput = document.getElementById("facilities-search");
const proFacilitiesND = document.getElementById("pro-facilities-no-data");
const proFacilitiesLabel = document.querySelectorAll(".pro-facilities-label");
const proFacilitiesItem = document.querySelectorAll(".pro-facilities-item");
const proFacilitiesItemClearBtn = document.getElementById("pro-facilities-item-clear-btn");
const proFacilitiesItemSaveBtn = document.getElementById("pro-facilities-item-save-btn");
// property phone number 1
const proCountryCode1 = document.getElementById("proc-country-code1");
const proPhoneNumber1 = document.getElementById("proc-phone-number1");
const proPhoneNumber1Error = document.getElementById("proc-phone-number1-error");
const proPhone2BoxCheck = document.getElementById("proc-phone2-box-check");
// property phone number 2
const proCountryCode2Box = document.getElementById("proc-country-code2-select-box")
const proCountryCode2 = document.getElementById("proc-country-code2");
const proPhoneNumber2 = document.getElementById("proc-phone-number2");
const proPhoneNumber2Error = document.getElementById("proc-phone-number2-error");

proSelectTypeBtn.addEventListener("click", () => {
    pbody.classList.add('overflow-hidden', 'scrollbar-hide')
    proSelectTypeModal.classList.replace("hidden", "flex");
    proTypeND.classList.add("hidden");
});

function typeModalClose() {
    pbody.classList.remove('overflow-hidden', 'scrollbar-hide')
    proSelectTypeModal.classList.replace("flex", "hidden");
};

proSelectTypeModal.addEventListener("click", (e) => {
    if (e.target === proSelectTypeModal) typeModalClose();
});

function proTypeSelected(id, name) {
    proSelectedTypeId.value = id;
    proSelectedType.innerText = name;
    typeModalClose();
};

proTypeSearchInput.addEventListener("input", () => {
    const type_value = proTypeSearchInput.value.trim().toLowerCase();
    let type_found = false;

    document.querySelectorAll(".pro-type-item").forEach((item) => {
        const type_name = item.getAttribute("data-type-name").toLowerCase();
        const type_match = type_name.includes(type_value);
        item.classList.toggle("hidden", !type_match);
        if (type_match) type_found = true;
    });
    proTypeND.classList.toggle("hidden", type_found);
});

proName.addEventListener("input", function () {
    let pro_name = this.value.trim();
    if (pro_name.length === 0) {
        proNameError.innerText = '{% trans "Property name is required." %}';
    } else {
        proNameError.innerText = "";
    }
});

proPrice.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
    let pro_price = this.value.trim();
    proPriceError.innerText = pro_price <= 0 ? '{% trans "Please enter the correct property price." %}' : '';
});

proSelectPreferredBtn.addEventListener("click", () => {
    pbody.classList.add('overflow-hidden', 'scrollbar-hide');
    proSelectPreferredModal.classList.replace("hidden", "flex");
    proPreferredND.classList.add("hidden");
});

function preferredModalClose() {
    pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
    proSelectPreferredModal.classList.replace("flex", "hidden");
};

proSelectPreferredModal.addEventListener("click", (e) => {
    if (e.target === proSelectPreferredModal) preferredModalClose();
});

proPreferredSearchInput.addEventListener("input", () => {
    const preferred_value = proPreferredSearchInput.value.trim().toLowerCase();
    let preferred_found = false;
    proPreferredLabel.forEach(label => {
        const preferred_name = label.getAttribute("data-preferred-label-name").toLowerCase();
        const preferred_match = preferred_name.includes(preferred_value);

        label.classList.toggle("hidden", !preferred_match);
        if (preferred_match) preferred_found = true;
    });
    proPreferredND.classList.toggle("hidden", preferred_found);
});

proPreferredItemClearBtn.addEventListener("click", () => {
    document.querySelectorAll(".pro-preferred-item:checked").forEach(item => {
        item.checked = false;
    });
    savePreferred();
});

function savePreferred() {
    const checkedPreferredItem = document.querySelectorAll(".pro-preferred-item:checked");
    const selectedPreferredItemNames = [];
    const selectedPreferredItemIds = [];

    checkedPreferredItem.forEach(item => {
        selectedPreferredItemNames.push(item.getAttribute("data-preferred-name").toLowerCase());
        selectedPreferredItemIds.push(item.value);
    });

    if (checkedPreferredItem.length > 0) {
        proSelectedPreferredNames.innerText = proSelectedPreferredNames.dataset.propertyPreferred;
        proSelectedPreferredIds.value = null;

    } else {
        proSelectedPreferredNames.innerText = proSelectedPreferredNames.dataset.propertyPreferred;
        proSelectedPreferredIds.value = null;
    }

    proPreferredItemSaveBtn.addEventListener("click", function () {
        if (checkedPreferredItem.length > 0) {
            proSelectedPreferredNames.innerText = selectedPreferredItemNames.join(", ");
            proSelectedPreferredIds.value = selectedPreferredItemIds;
        } else {
            proSelectedPreferredNames.innerText = proSelectedPreferredNames.dataset.propertyPreferred;
            proSelectedPreferredIds.value = null;
        }
        preferredModalClose();
    });
};

proPreferredItem.forEach(item => {
    item.addEventListener("change", savePreferred);
});
savePreferred();

proSelectFacilitiesBtn.addEventListener("click", () => {
    pbody.classList.add('overflow-hidden', 'scrollbar-hide');
    proSelectFacilitiesModal.classList.replace("hidden", "flex");
    proFacilitiesND.classList.add("hidden");
});

function facilitiesModalClose() {
    pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
    proSelectFacilitiesModal.classList.replace("flex", "hidden");
};

proSelectFacilitiesModal.addEventListener("click", (e) => {
    if (e.target === proSelectFacilitiesModal) facilitiesModalClose();
});

proFacilitiesSearchInput.addEventListener("input", () => {
    const facilities_value = proFacilitiesSearchInput.value.trim().toLowerCase();
    let facilities_found = false;
    proFacilitiesLabel.forEach(label => {
        const facilities_name = label.getAttribute("data-facilities-label-name").toLowerCase();
        const facilities_match = facilities_name.includes(facilities_value);

        label.classList.toggle("hidden", !facilities_match);
        if (facilities_match) facilities_found = true;
    });
    proFacilitiesND.classList.toggle("hidden", facilities_found);
});

proFacilitiesItemClearBtn.addEventListener("click", () => {
    document.querySelectorAll(".pro-facilities-item:checked").forEach(item => {
        item.checked = false;
    });
    saveFacilities();
});

function saveFacilities() {
    const checkedFacilitiesItem = document.querySelectorAll(".pro-facilities-item:checked");
    const selectedFacilitiesItemNames = [];
    const selectedFacilitiesItemIds = [];

    checkedFacilitiesItem.forEach(item => {
        selectedFacilitiesItemNames.push(item.getAttribute("data-facilities-name").toLowerCase());
        selectedFacilitiesItemIds.push(item.value);
    });

    if (checkedFacilitiesItem.length > 0) {
        proSelectedFacilitiesNames.innerText = proSelectedFacilitiesNames.dataset.propertyFacilities;
        proSelectedFacilitiesIds.value = null;

    } else {
        proSelectedFacilitiesNames.innerText = proSelectedFacilitiesNames.dataset.propertyFacilities;
        proSelectedFacilitiesIds.value = null;
    }

    proFacilitiesItemSaveBtn.addEventListener("click", function () {
        if (checkedFacilitiesItem.length > 0) {
            proSelectedFacilitiesNames.innerText = selectedFacilitiesItemNames.join(", ");
            proSelectedFacilitiesIds.value = selectedFacilitiesItemIds;
        } else {
            proSelectedFacilitiesNames.innerText = proSelectedFacilitiesNames.dataset.propertyFacilities;
            proSelectedFacilitiesIds.value = null;
        }
        facilitiesModalClose();
    });
};

proFacilitiesItem.forEach(item => {
    item.addEventListener("change", saveFacilities);
});
saveFacilities();

[proCountryCode1, proCountryCode2].forEach(countrycodebox => {
    countrycodebox.disabled = true;
});

const togglePhone2 = (disabled) => {
    proPhoneNumber2.disabled = disabled;
    proCountryCode2Box.classList.toggle("text-gray-400", disabled);
    proPhoneNumber2.classList.toggle("text-gray-400", disabled);
    proPhoneNumber2.value = "";
};
togglePhone2(true);

proPhone2BoxCheck.addEventListener("change", (e) => {
    togglePhone2(!e.target.checked);
});

proPhoneNumber1.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
    let pro_phone_number1 = this.value.trim();
    let pro_phone_number2 = proPhoneNumber2.value.trim();
    proPhoneNumber1Error.innerText = pro_phone_number1.length < 10 ? '{% trans "Phone number must be at least 10 digits." %}' : '';
    proPhoneNumber1Error.innerText = pro_phone_number1 === pro_phone_number2 ? '{% Please enter a unique phone number. %}' : '';
});

proPhoneNumber2.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
    let pro_phone_number1 = proPhoneNumber1.value.trim();
    let pro_phone_number2 = this.value.trim();
    proPhoneNumber2Error.innerText = proPhoneNumber2Error.length < 10 ? '{% trans "Phone number must be at least 10 digits." %}' : '';
    proPhoneNumber2Error.innerText = pro_phone_number2 === pro_phone_number1 ? '{% Please enter a unique phone number. %}' : '';
});

function clearformfield() {
    addpropertyform.reset();
    togglePhone2(true);
    proSelectedType.innerText = proSelectedType.dataset.propertyType;
    proSelectedTypeId.value = null;
    proSelectedPreferredNames.innerText = proSelectedPreferredNames.dataset.propertyPreferred;
    proSelectedPreferredIds.value = null;
    proSelectedFacilitiesNames.innerText = proSelectedFacilitiesNames.dataset.propertyFacilities;
    proSelectedFacilitiesIds.value = null;
};