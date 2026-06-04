// ---------- State Modal ------------
const bStateBtn = document.getElementById("bStateBtn");
const bSelectedState = document.getElementById("bSelectedState");
const bStateId = document.getElementById("bStateId");
const bStateModal = document.getElementById("bStateModal");
const bStateSeaI = document.getElementById("bSearchState");
const bStateList = document.getElementById("stateList");
const bStateND = document.getElementById("bStateNotData");

bStateBtn.addEventListener("click", () => {
  bStateModal.classList.replace("hidden", "flex");
  bStateND.classList.add("hidden");
  setTimeout(() => bStateSeaI.focus(), 100);

  let bCountry_ID = document.getElementById("bCountryId").value;

  fetch(`/get-states/?country_id=${bCountry_ID}`)
    .then((res) => res.json())
    .then((data) => {
      let html = "";
      if (!data.states || data.states.length === 0) {
        bStateList.innerHTML = "";
        bStateND.classList.remove("hidden");
        return;
      }
      data.states.forEach((s) => {
        let name = s.name.charAt(0).toUpperCase() + s.name.slice(1);
        html += `<div class="bState-item flex justify-between items-center p-3 rounded-3xl cursor-pointer hover:bg-orange-50 dark:hover:bg-[#1F2937] transition-all duration-200" data-name="${s.name.toLowerCase()}" onclick="bStateSelected('${s.id}','${name}')"><span>${name}</span></div>`;
      });
      bStateList.innerHTML = html;
    });
});
function bCloseStateModal() {
  bStateModal.classList.replace("flex", "hidden");
}
function bStateSelected(id, name) {
  bStateId.value = id;
  bSelectedState.innerText = name;
  bcitylabel.classList.remove("disabled");
  bcitybtn.disabled = false;
  bCityId.value = "";
  bSelectedCity.innerText = bSelectedCity.getAttribute("data-select-city");
  bCloseStateModal();
}
bStateSeaI.addEventListener("keyup", () => {
  let bSvalue = bStateSeaI.value.toLowerCase();
  let bSitems = document.querySelectorAll(".bState-item");
  let visibleCount = 0;

  bSitems.forEach((item) => {
    let state_name = item.getAttribute("data-name");

    if (state_name.includes(bSvalue)) {
      item.style.display = "flex";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });
  if (visibleCount === 0) {
    bStateND.classList.remove("hidden");
  } else {
    bStateND.classList.add("hidden");
  }
});
bStateModal.addEventListener("click", (e) => {
  if (e.target === bStateModal) bCloseStateModal();
});
