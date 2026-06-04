// ---------- City Modal ------------
const bCityBtn = document.getElementById("bCityBtn");
const bSelectedCity = document.getElementById("bSelectedCity");
const bCityId = document.getElementById("bCityId");
const bCityModal = document.getElementById("bCityModal");
const bCitySeaI = document.getElementById("bSearchCity");
const bCityList = document.getElementById("cityList");
const bCityND = document.getElementById("bCityNotData");

bCityBtn.addEventListener("click", () => {
  bCityModal.classList.replace("hidden", "flex");
  bCityND.classList.add("hidden");
  setTimeout(() => bCitySeaI.focus(), 100);
  let bState_ID = document.getElementById("bStateId").value;
  fetch(`/get-cities/?state_id=${bState_ID}`)
    .then((res) => res.json())
    .then((data) => {
      let html = "";
      if (!data.cities || data.cities.length === 0) {
        bCityList.innerHTML = "";
        bCityND.classList.remove("hidden");
        return;
      }
      data.cities.forEach((c) => {
        let name = c.name.charAt(0).toUpperCase() + c.name.slice(1);
        html += `<div class="bCity-item flex justify-between items-center p-3 rounded-3xl cursor-pointer hover:bg-orange-50 dark:hover:bg-[#1F2937] transition-all duration-200" data-name="${c.name.toLowerCase()}" onclick="bCitySelected('${c.id}','${name}')"><span>${name}</span></div>`;
      });
      bCityList.innerHTML = html;
    });
});
function bCloseCityModal() {
  bCityModal.classList.replace("flex", "hidden");
}
function bCitySelected(id, name) {
  bCityId.value = id;
  bSelectedCity.innerText = name;
  bCloseCityModal();
}
bCitySeaI.addEventListener("keyup", () => {
  let bCvalue = bCitySeaI.value.toLowerCase();
  let bCitems = document.querySelectorAll(".bCity-item");
  let visibleCount = 0;

  bCitems.forEach((item) => {
    let city_name = item.getAttribute("data-name");

    if (city_name.includes(bCvalue)) {
      item.style.display = "flex";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });
  if (visibleCount === 0) {
    bCityND.classList.remove("hidden");
  } else {
    bCityND.classList.add("hidden");
  }
});
bCityModal.addEventListener("click", (e) => {
  if (e.target === bCityModal) bCloseCityModal();
});
