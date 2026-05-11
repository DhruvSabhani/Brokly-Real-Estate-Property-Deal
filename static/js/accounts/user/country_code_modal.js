// ----------  User side ------------
const uCodeBtn = document.getElementById("uCountryCodeBtn");
const uSelectedCode = document.getElementById("uSelectedCode");
const uCountryId = document.getElementById("uCountryId");
const uCountryModal = document.getElementById("uCountryModal");
const uConSearchInput = document.getElementById("uSearchCountryCode");
const uCodeNotData = document.getElementById("uNotData");

uCodeNotData.classList.add("hidden");

if (!uSelectedCode.innerText.trim() || !uCountryId.value) {
  uCountryId.value = "1";
  uSelectedCode.innerText = "+91";
}
uCodeBtn.addEventListener("click", () => {
  uCountryModal.classList.replace("hidden", "flex");
});

function uCloseCountryCodeModal() {
  uCountryModal.classList.replace("flex", "hidden");
}

function uSelectedCountry(id, code) {
  uCountryId.value = id;
  uSelectedCode.innerText = code;
  uCloseCountryCodeModal();
}

uConSearchInput.addEventListener("keyup", () => {
  let value = uConSearchInput.value.toLowerCase();
  let found = false;

  document.querySelectorAll(".uCountry-item").forEach((item) => {
    let country_name = item.getAttribute("data-name").toLowerCase();
    let country_code = item.getAttribute("data-code").toLowerCase();

    if (country_name.includes(value) || country_code.includes(value)) {
      item.style.display = "flex";
      found = true;
    } else {
      item.style.display = "none";
    }
  });

  if (found) {
    uCodeNotData.classList.add("hidden");
  } else {
    uCodeNotData.classList.remove("hidden");
  }
});

uCountryModal.addEventListener("click", (e) => {
  if (e.target === uCountryModal) uCloseCountryCodeModal();
});
