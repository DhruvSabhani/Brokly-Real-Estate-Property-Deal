// ---------- City Modal ------------
const uCityBtn = document.getElementById("uCityBtn");
const uSelectedCity = document.getElementById("uSelectedCity");
const uCityId = document.getElementById("uCityId");
const uCityModal = document.getElementById("uCityModal");
const uCitySeaI = document.getElementById("uSearchCity");
const uCityList = document.getElementById("cityList");
const uCityND = document.getElementById("uCityNotData");
uCityBtn.addEventListener("click", () => {
  uCityModal.classList.replace("hidden", "flex");
  uCityND.classList.add("hidden");
  setTimeout(() => uStateSeaI.focus(), 100);
  let uState_ID = document.getElementById("uStateId").value;
  fetch(`/get-cities/?state_id=${uState_ID}`)
    .then((res) => res.json())
    .then((data) => {
      let html = "";
      if (!data.cities || data.cities.length === 0) {
        uCityList.innerHTML = "";
        uCityND.classList.remove("hidden");
        return;
      }
      data.cities.forEach((c) => {
        let name = c.name.charAt(0).toUpperCase() + c.name.slice(1);
        html += `<div class="uCity-item flex justify-between items-center p-2 rounded cursor-pointer dark:hover:bg-gray-700" data-name="${c.name.toLowerCase()}" onclick="uCitySelected('${c.id}','${name}')"><span>${name}</span></div>`;
      });
      uCityList.innerHTML = html;
    });
});
function uCloseCityModal() {
  uCityModal.classList.replace("flex", "hidden");
}
function uCitySelected(id, name) {
  uCityId.value = id;
  uSelectedCity.innerText = name;
  uUpdateBtn.disabled = false;
  uCloseCityModal();
}
uCitySeaI.addEventListener("keyup", () => {
  let uCvalue = uCitySeaI.value.toLowerCase();
  let uCitems = document.querySelectorAll(".uCity-item");
  let visibleCount = 0;

  uCitems.forEach((item) => {
    let city_name = item.getAttribute("data-name");

    if (city_name.includes(uCvalue)) {
      item.style.display = "flex";
      visibleCount++;
    } else {
      item.style.display = "none";
    }
  });
  if (visibleCount === 0) {
    uCityND.classList.remove("hidden");
  } else {
    uCityND.classList.add("hidden");
  }
});
uCityModal.addEventListener("click", (e) => {
  if (e.target === uCityModal) uCloseCityModal();
});
