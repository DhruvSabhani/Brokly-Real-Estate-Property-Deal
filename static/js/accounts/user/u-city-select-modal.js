// ---------- City Modal ------------
const uCityBtn = document.getElementById('uCityBtn');
const uSelectedCity = document.getElementById('uSelectedCity');
const uCityId = document.getElementById('uCityId');
const uCityModal = document.getElementById('uCityModal');
const uCitySeaI = document.getElementById('uSearchCity');
const uCityList = document.getElementById('cityList');
const uCityND = document.getElementById('uCityNotData');

uCityBtn.addEventListener('click', () => {
  uCityModal.classList.replace('hidden', 'flex');
  uCityND.classList.add('hidden');
  setTimeout(() => uCitySeaI.focus(), 100);

  let uState_ID = document.getElementById('uStateId').value;

  fetch(`/get-cities/?state_id=${uState_ID}&panel=user`)
    .then((res) => res.json())
    .then((data) => {
      let html = '';
      if (!data.cities || data.cities.length === 0) {
        uCityList.innerHTML = '';
        uCityND.classList.remove('hidden');
        return;
      }
      data.cities.forEach((city) => {
        let cityName = city.name || '';
        if (cityName && typeof cityName === 'string' && /^[A-Za-z]/.test(cityName)) {
          cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        }
        html += `<div class="uCity-item flex justify-between items-center p-3 rounded-3xl cursor-pointer hover:bg-orange-50 dark:hover:bg-[#1F2937] transition-all duration-200" data-name="${cityName}" onclick="uCitySelected('${city.id}','${cityName}')"><span>${cityName}</span></div>`;
      });
      uCityList.innerHTML = html;
    })
    .catch((error) => {
      console.log(error);
      uCityList.innerHTML = '';
      uCityND.classList.remove('hidden');
    });
});

function uCloseCityModal() {
  uCityModal.classList.replace('flex', 'hidden');
}

function uCitySelected(id, name) {
  uCityId.value = id;
  uSelectedCity.innerText = name;
  uCloseCityModal();
}

uCitySeaI.addEventListener('keyup', () => {
  let uCvalue = uCitySeaI.value.toLowerCase();
  let uCitems = document.querySelectorAll('.uCity-item');
  let visibleCount = 0;

  uCitems.forEach((item) => {
    const city_name = (item.getAttribute('data-name') || '').toLowerCase();

    if (city_name.includes(uCvalue)) {
      item.style.display = 'flex';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  if (visibleCount === 0) {
    uCityND.classList.remove('hidden');
  } else {
    uCityND.classList.add('hidden');
  }
});

uCityModal.addEventListener('click', (e) => {
  if (e.target === uCityModal) uCloseCityModal();
});
