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
// property amount
const proAmount = document.getElementById("proc-amount");
const proAmountError = document.getElementById("proc-amount-error");
// perferred btn
const proSelectPerferredBtn = document.getElementById("proc-select-preferred-btn");
const proSelectedPerferredNames = document.getElementById("proc-selected-preferred-names");
const proSelectedPerferredIds = document.getElementById("proc-selected-preferred-ids");
// perferred modal
const proSelectPerferredModal = document.getElementById("proc-select-preferred-modal");
const proPerferredSearchInput = document.getElementById("perferred-search");
const proPerferredND = document.getElementById("pro-perferred-no-data");
const proPerferredLabel = document.querySelectorAll(".pro-perferred-label");
const proPerferredItem = document.querySelectorAll(".pro-perferred-item");
const proPerferredItemSaveBtn = document.getElementById("pro-perferred-item-save-btn");
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
const proFacilitiesItemSaveBtn = document.getElementById("pro-facilities-item-save-btn");
// property phone number 1
const proCountryCode1 = document.getElementById("proc-country-code1");
// proCountryCode1.disabled = true;
const proPhoneNumber1 = document.getElementById("proc-phone-number1");
const proPhoneNumber1Error = document.getElementById("proc-phone-number1-error");
const proPhone2BoxCheck = document.getElementById("proc-phone2-box-check");
// property phone number 2
const proCountryCode2Box = document.getElementById("proc-country-code2-select-box")
const proCountryCode2 = document.getElementById("proc-country-code2");
const proPhoneNumber2 = document.getElementById("proc-phone-number2");
const proPhoneNumber2Error = document.getElementById("proc-phone-number2-error");

proCountryCode1.disabled = proCountryCode2.disabled = true;

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

proAmount.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");

    let pro_amount = this.value.trim();
    if (pro_amount.length === 0) {
        proAmountError.innerText = '{% trans "Property amount is required." %}';
    } else {
        proAmountError.innerText = '';
    }
});

proSelectPerferredBtn.addEventListener("click", () => {
    pbody.classList.add('overflow-hidden', 'scrollbar-hide');
    proSelectPerferredModal.classList.replace("hidden", "flex");
    proPerferredND.classList.add("hidden");
});

function perferredModalClose() {
    pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
    proSelectPerferredModal.classList.replace("flex", "hidden");
};

proSelectPerferredModal.addEventListener("click", (e) => {
    if (e.target === proSelectPerferredModal) perferredModalClose();
});

proPerferredSearchInput.addEventListener("input", () => {
    const perferred_value = proPerferredSearchInput.value.trim().toLowerCase();
    let perferred_found = false;
    proPerferredLabel.forEach(label => {
        const perferred_name = label.getAttribute("data-perferred-label-name").toLowerCase();
        const perferred_match = perferred_name.includes(perferred_value);

        label.classList.toggle("hidden", !perferred_match);
        if (perferred_match) perferred_found = true;
    });
    proPerferredND.classList.toggle("hidden", perferred_found);
});

function savePerferred() {
    const checkedPerferredItem = document.querySelectorAll(".pro-perferred-item:checked");
    const selectedPerferredItemNames = [];
    const selectedPerferredItemIds = [];

    checkedPerferredItem.forEach(item => {
        selectedPerferredItemNames.push(item.getAttribute("data-perferred-name").toLowerCase());
        selectedPerferredItemIds.push(item.value);
    });

    if (checkedPerferredItem.length > 0) {
        proSelectedPerferredNames.innerText = "{% trans 'Select Preferred' %}";
        proSelectedPerferredIds.value = "";

    } else {
        proSelectedPerferredNames.innerText = "{% trans 'Select Preferred' %}";
        proSelectedPerferredIds.value = "";
    }

    proPerferredItemSaveBtn.addEventListener("click", function () {
        if (checkedPerferredItem.length > 0) {
            proSelectedPerferredNames.innerText = selectedPerferredItemNames.join(", ");
            proSelectedPerferredIds.value = selectedPerferredItemIds;
        } else {
            proSelectedPerferredNames.innerText = "{% trans 'Select Preferred' %}";
            proSelectedPerferredIds.value = "";
        }
        perferredModalClose();
    });
};

proPerferredItem.forEach(item => {
    item.addEventListener("change", savePerferred);
});
savePerferred();

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

function saveFacilities() {
    const checkedFacilitiesItem = document.querySelectorAll(".pro-facilities-item:checked");
    const selectedFacilitiesItemNames = [];
    const selectedFacilitiesItemIds = [];

    checkedFacilitiesItem.forEach(item => {
        selectedFacilitiesItemNames.push(item.getAttribute("data-facilities-name").toLowerCase());
        selectedFacilitiesItemIds.push(item.value);
    });

    if (checkedFacilitiesItem.length > 0) {
        proSelectedFacilitiesNames.innerText = "{% trans 'Select Facilities' %}";
        proSelectedFacilitiesIds.value = "";

    } else {
        proSelectedFacilitiesNames.innerText = "{% trans 'Select Facilities' %}";
        proSelectedFacilitiesIds.value = "";
    }

    proFacilitiesItemSaveBtn.addEventListener("click", function () {
        if (checkedFacilitiesItem.length > 0) {
            proSelectedFacilitiesNames.innerText = selectedFacilitiesItemNames.join(", ");
            proSelectedFacilitiesIds.value = selectedFacilitiesItemIds;
        } else {
            proSelectedFacilitiesNames.innerText = "{% trans 'Select Facilities' %}";
            proSelectedFacilitiesIds.value = "";
        }
        facilitiesModalClose();
    });
};

proFacilitiesItem.forEach(item => {
    item.addEventListener("change", saveFacilities);
});
saveFacilities();

proPhoneNumber1.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);

    let pro_phone_number1 = this.value.trim();
    if (pro_phone_number1.length === 0) {
        proPhoneNumber1Error.innerText = '{% trans "Property phone number is required." %}';
    } else {
        proPhoneNumber1Error.innerText = '';
    }
});

proPhoneNumber2.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);

    let pro_phone_number2 = this.value.trim();
    if (pro_phone_number2.length === 0) {
        proPhoneNumber2Error.innerText = '{% trans "Property phone number is required." %}';
    } else {
        proPhoneNumber2Error.innerText = '';
    }
});

