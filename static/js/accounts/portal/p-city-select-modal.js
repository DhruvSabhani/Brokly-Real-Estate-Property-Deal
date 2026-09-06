// ---------- City Modal ------------
const pCityBtn = document.getElementById('pCityBtn');
const pSelectedCity = document.getElementById('pSelectedCity');
const pCityId = document.getElementById('pCityId');
const pCityModal = document.getElementById('pCityModal');
const pCitySeaI = document.getElementById('pSearchCity');
const pCityList = document.getElementById('cityList');
const pCityND = document.getElementById('pCityNotData');

pCityBtn.addEventListener('click', () => {
  pCityModal.classList.replace('hidden', 'flex');
  pCityND.classList.add('hidden');
  setTimeout(() => pCitySeaI.focus(), 100);

  let pState_ID = document.getElementById('pStateId').value;

  fetch(`/portal/get-cities/?state_id=${pState_ID}&panel=portal`)
    .then((res) => res.json())
    .then((data) => {
      let html = '';
      if (!data.cities || data.cities.length === 0) {
        pCityList.innerHTML = '';
        pCityND.classList.remove('hidden');
        return;
      }
      data.cities.forEach((city) => {
        let cityName = city.name || '';
        if (cityName && typeof cityName === 'string' && /^[A-Za-z]/.test(cityName)) {
          cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        }
        html += `<div class="pCity-item flex justify-between items-center p-3 rounded-3xl cursor-pointer hover:bg-orange-50 dark:hover:bg-[#1F2937] transition-all duration-200" data-name="${cityName}" onclick="pCitySelected('${city.id}','${cityName}')"><span>${cityName}</span></div>`;
      });
      pCityList.innerHTML = html;
    })
    .catch((error) => {
      console.log(error);
      pCityList.innerHTML = '';
      pCityND.classList.remove('hidden');
    });
});

function pCloseCityModal() {
  pCityModal.classList.replace('flex', 'hidden');
}

function pCitySelected(id, name) {
  pCityId.value = id;
  pSelectedCity.innerText = name;
  pCloseCityModal();
}

pCitySeaI.addEventListener('keyup', () => {
  let pCvalue = pCitySeaI.value.toLowerCase();
  let pCitems = document.querySelectorAll('.pCity-item');
  let visibleCount = 0;

  pCitems.forEach((item) => {
    const city_name = (item.getAttribute('data-name') || '').toLowerCase();

    if (city_name.includes(pCvalue)) {
      item.style.display = 'flex';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  if (visibleCount === 0) {
    pCityND.classList.remove('hidden');
  } else {
    pCityND.classList.add('hidden');
  }
});

pCityModal.addEventListener('click', (e) => {
  if (e.target === pCityModal) pCloseCityModal();
});
