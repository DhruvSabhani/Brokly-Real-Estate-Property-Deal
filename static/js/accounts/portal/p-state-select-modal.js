// ---------- State Modal ------------
const pStateBtn = document.getElementById('pStateBtn');
const pSelectedState = document.getElementById('pSelectedState');
const pStateId = document.getElementById('pStateId');
const pStateModal = document.getElementById('pStateModal');
const pStateSeaI = document.getElementById('pSearchState');
const pStateList = document.getElementById('stateList');
const pStateND = document.getElementById('pStateNotData');

pStateBtn.addEventListener('click', () => {
  pStateModal.classList.replace('hidden', 'flex');
  pStateND.classList.add('hidden');
  setTimeout(() => pStateSeaI.focus(), 100);

  let pCountry_ID = document.getElementById('pCountryId').value;

  fetch(`/portal/get-states/?country_id=${pCountry_ID}&panel=portal`)
    .then((res) => res.json())
    .then((data) => {
      let html = '';
      if (!data.states || data.states.length === 0) {
        pStateList.innerHTML = '';
        pStateND.classList.remove('hidden');
        return;
      }
      pStateND.classList.add('hidden');
      data.states.forEach((state) => {
        let stateName = state.name || '';
        if (stateName && typeof stateName === 'string' && /^[A-Za-z]/.test(stateName)) {
          stateName = stateName.charAt(0).toUpperCase() + stateName.slice(1);
        }
        html += `<div class="pState-item flex justify-between items-center p-3 rounded-3xl cursor-pointer hover:bg-orange-50 dark:hover:bg-[#1F2937] transition-all duration-200" data-name="${stateName}" onclick="pStateSelected('${state.id}','${stateName}')"><span>${stateName}</span></div>`;
      });
      pStateList.innerHTML = html;
    })
    .catch((error) => {
      console.log(error);
      pStateList.innerHTML = '';
      pStateND.classList.remove('hidden');
    });
});
function pCloseStateModal() {
  pStateModal.classList.replace('flex', 'hidden');
}
function pStateSelected(id, name) {
  pStateId.value = id;
  pSelectedState.innerText = name;
  pcitylabel.classList.remove('disabled');
  pcitybtn.disabled = false;
  pCityId.value = '';
  pSelectedCity.innerText = pSelectedCity.getAttribute('data-select-city');
  pCloseStateModal();
}
pStateSeaI.addEventListener('keyup', () => {
  let pSvalue = pStateSeaI.value.trim().toLowerCase();
  let pSitems = document.querySelectorAll('.pState-item');
  let visibleCount = 0;

  pSitems.forEach((item) => {
    const state_name = (item.getAttribute('data-name') || '').toLowerCase();

    if (state_name.includes(pSvalue)) {
      item.style.display = 'flex';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  if (visibleCount === 0) {
    pStateND.classList.remove('hidden');
  } else {
    pStateND.classList.add('hidden');
  }
});
pStateModal.addEventListener('click', (e) => {
  if (e.target === pStateModal) pCloseStateModal();
});
