// ----------  Portal side ------------
const portallangbtn = document.getElementById('portal-lang-btn');
const portalselectedlang = document.getElementById('portal-selected-lang');
const portallangmodal = document.getElementById('portal-lang-modal');
const portallang = document.getElementById('portal-lang');
const portallangselectloader = document.getElementById('portal-lang-select-loader');

if (!localStorage.getItem('plangCode')) {
  localStorage.setItem('plangId', '1');
  localStorage.setItem('plangName', 'English');
  localStorage.setItem('plangCode', 'en');
}

function getCSRF() {
  return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

portallangbtn.addEventListener('click', () => {
  document.getElementById('portal').classList.add('overflow-hidden', 'scrollbar-hide');
  portallangmodal.classList.remove('hidden');
  portallangmodal.classList.add('flex');

  setTimeout(() => {
    portallangmodal.classList.remove('opacity-0');
    portallang.classList.remove('scale-95');
  }, 10);

  portallangselectloader.classList.replace('flex', 'hidden');
  portallang.classList.remove('hidden');
});

function langModalClose() {
  setTimeout(() => {
    document.getElementById('portal').classList.remove('overflow-hidden', 'scrollbar-hide');
    portallangmodal.classList.remove('flex');
    portallangmodal.classList.add('hidden');
  }, 300);

  portallangmodal.classList.add('opacity-0');
  portallang.classList.add('scale-95');
}

function portalLangSelected(id, name, code) {
  localStorage.setItem('plangId', id);
  localStorage.setItem('plangName', name);
  localStorage.setItem('plangCode', code);

  portallang.classList.add('hidden');
  portallangselectloader.classList.replace('hidden', 'flex');

  const formData = new FormData();
  formData.append('language', code);
  formData.append('panel', 'portal');

  fetch('/change-language/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCSRF(),
    },
    body: formData,
    credentials: 'same-origin',
  })
    .then((res) => {
      if (res.ok) {
        setTimeout(() => {
          portalselectedlang.innerText = name;
          langModalClose();
        }, 500);
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error setting language:', error);
      portallangselectloader.classList.replace('flex', 'hidden');
      portallang.classList.remove('hidden');
      alert(window.languageEr.checkLang);
    });
}

portallangmodal.addEventListener('click', (e) => {
  if (e.target === portallangmodal) langModalClose();
});
