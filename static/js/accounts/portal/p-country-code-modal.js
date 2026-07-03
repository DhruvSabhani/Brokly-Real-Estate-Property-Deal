// ----------  Portal side ------------
const pCodeBtn = document.getElementById("pCountryCodeBtn");
const pSelectedCode = document.getElementById("pSelectedCode");
const pCountryId = document.getElementById("pCountryId");
const pCountryModal = document.getElementById("pCountryModal");
const pConSearchInput = document.getElementById("pSearchCountryCode");
const pCodeNotData = document.getElementById("pNotData");

pCodeNotData.classList.add("hidden");

pCodeBtn.addEventListener("click", () => {
  pCountryModal.classList.replace("hidden", "flex");
});

function pCloseCountryCodeModal() {
  pCountryModal.classList.replace("flex", "hidden");
}

function pSelectedCountry(id, code) {
  pCountryId.value = id;
  pSelectedCode.innerText = code;
  pCloseCountryCodeModal();
}

pConSearchInput.addEventListener("keyup", () => {
  let value = pConSearchInput.value.toLowerCase();
  let found = false;

  document.querySelectorAll(".pCountry-item").forEach((item) => {
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
    pCodeNotData.classList.add("hidden");
  } else {
    pCodeNotData.classList.remove("hidden");
  }
});

pCountryModal.addEventListener("click", (e) => {
  if (e.target === pCountryModal) pCloseCountryCodeModal();
});
