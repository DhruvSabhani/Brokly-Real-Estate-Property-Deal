// ----------  Broker side ------------
const bCodeBtn = document.getElementById("bCountryCodeBtn");
const bSelectedCode = document.getElementById("bSelectedCode");
const bCountryId = document.getElementById("bCountryId");
const bCountryModal = document.getElementById("bCountryModal");
const bConSearchInput = document.getElementById("bSearchCountryCode");
const bCodeNotData = document.getElementById("bNotData");

bCodeNotData.classList.add("hidden");

bCodeBtn.addEventListener("click", () => {
  bCountryModal.classList.replace("hidden", "flex");
});

function bCloseCountryCodeModal() {
  bCountryModal.classList.replace("flex", "hidden");
}

function bSelectedCountry(id, code) {
  bCountryId.value = id;
  bSelectedCode.innerText = code;
  bCloseCountryCodeModal();
}

bConSearchInput.addEventListener("keyup", () => {
  let value = bConSearchInput.value.toLowerCase();
  let found = false;

  document.querySelectorAll(".bCountry-item").forEach((item) => {
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
    bCodeNotData.classList.add("hidden");
  } else {
    bCodeNotData.classList.remove("hidden");
  }
});

bCountryModal.addEventListener("click", (e) => {
  if (e.target === bCountryModal) bCloseCountryCodeModal();
});
