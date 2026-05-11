// ---------- State Modal ------------
const uStateBtn = document.getElementById("uStateBtn");
const uSelectedState = document.getElementById("uSelectedState");
const uStateId = document.getElementById("uStateId");
const uStateModal = document.getElementById("uStateModal");
const uStateSeaI = document.getElementById("uSearchState");
const uStateList = document.getElementById("stateList");
const uStateND = document.getElementById("uStateNotData");
uStateBtn.addEventListener("click", () => {
  uStateModal.classList.replace("hidden", "flex");
  uStateND.classList.add("hidden");
  setTimeout(() => uStateSeaI.focus(), 100);

  let uCountry_ID = document.getElementById("uCountryId").value;

  fetch(`/get-states/?country_id=${uCountry_ID}`)
    .then((res) => res.json())
    .then((data) => {
      let html = "";
      if (!data.states || data.states.length === 0) {
        uStateList.innerHTML = "";
        uStateND.classList.remove("hidden");
        return;
      }
      data.states.forEach((s) => {
        let name = s.name.charAt(0).toUpperCase() + s.name.slice(1);
        html += `<div class="uState-item flex justify-between items-center p-2 rounded cursor-pointer dark:hover:bg-gray-700" data-name="${s.name.toLowerCase()}" onclick="uStateSelected('${s.id}','${name}')"><span>${name}</span></div>`;
      });
      uStateList.innerHTML = html;
    });
});
function uCloseStateModal() {
  uStateModal.classList.replace("flex", "hidden");
}
function uStateSelected(id, name) {
  uStateId.value = id;
  uSelectedState.innerText = name;
  ucitybtn.disabled = false;
  uCityId.value = "";
  uSelectedCity.innerText = "" || "Select City";
  uUpdateBtn.disabled = false;
  uCloseStateModal();
}
uStateSeaI.addEventListener("keyup", () => {
  let uSvalue = uStateSeaI.value.toLowerCase();
  let uSitems = document.querySelectorAll(".uState-item");
  let visibleCount = 0;

  uSitems.forEach((item) => {
    let state_name = item.getAttribute("data-name");

    if (state_name.includes(uSvalue)) {
      item.style.display = "flex";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });
  if (visibleCount === 0) {
    uStateND.classList.remove("hidden");
  } else {
    uStateND.classList.add("hidden");
  }
});
uStateModal.addEventListener("click", (e) => {
  if (e.target === uStateModal) uCloseStateModal();
});
