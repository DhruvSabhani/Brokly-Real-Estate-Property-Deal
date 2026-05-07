// ----------  User side ------------
const uBtn = document.getElementById("uCountryCodeBtn");
const uSelectedCode = document.getElementById("uSelectedCode");
const uCountryId = document.getElementById("uCountryId");
const uModal = document.getElementById("uCountryModal");
const uSearchInput = document.getElementById("uSearchCountryCode");
const uNotData = document.getElementById("uNotData");

uNotData.classList.add("hidden");

if (!uSelectedCode.innerText.trim() || !uCountryId.value) {
  uCountryId.value = "1";
  uSelectedCode.innerText = "+91";
}
uBtn.addEventListener("click", () => {
  uModal.classList.remove("hidden");
  uModal.classList.add("flex");
});

function uCloseCountryCodeModal() {
  uModal.classList.add("hidden");
  uModal.classList.remove("flex");
}

function uSelectedCountry(id, code) {
  uCountryId.value = id;
  uSelectedCode.innerText = code;
  uCloseCountryCodeModal();
}

uSearchInput.addEventListener("keyup", () => {
  let value = uSearchInput.value.toLowerCase();

  document.querySelectorAll(".uCountry-item").forEach((item) => {
    let country_id = item.getAttribute("data-id");
    let country_code = item.getAttribute("data-code");

    if (country_name.includes(value) || country_code.includes(value)) {
      item.style.display = "flex";
      uNotData.classList.add("hidden");
    } else {
      item.style.display = "none";
      uNotData.classList.remove("hidden");
    }
  });
});

uModal.addEventListener("click", (e) => {
  if (e.target === uModal) uCloseCountryCodeModal();
});
