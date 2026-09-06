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
document.documentElement.lang = localStorage.getItem('plangCode');

function getCSRF() {
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
  return csrfToken ? csrfToken.value : '';
}

if (portallangbtn) {
  portallangbtn.addEventListener('click', () => {
    const portalElement = document.getElementById('portal');
    if (portalElement) {
      portalElement.classList.add('overflow-hidden', 'scrollbar-hide');
    }
    portallangmodal.classList.remove('hidden');
    portallangmodal.classList.add('flex');

    portallang.classList.remove('hidden');

    portallangselectloader.classList.remove('flex');
    portallangselectloader.classList.add('hidden');

    setTimeout(() => {
      portallangmodal.classList.remove('opacity-0');
      portallang.classList.remove('scale-95');
    }, 10);
  });
}

function langModalClose() {
  portallangmodal.classList.add('opacity-0');
  portallang.classList.add('scale-95');

  setTimeout(() => {
    const portalElement = document.getElementById('portal');
    if (portalElement) {
      portalElement.classList.remove('overflow-hidden', 'scrollbar-hide');
    }
    portallangmodal.classList.remove('flex');
    portallangmodal.classList.add('hidden');
  }, 300);
}

function portalLangSelected(id, name, code) {
  if (portallangselectloader.classList.contains('flex')) {
    return;
  }
  portallang.classList.add('hidden');
  portallangselectloader.classList.remove('hidden');
  portallangselectloader.classList.add('flex');

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
      if (!res.ok) {
        throw new Error('Failed to change language');
      }
      return res.json();
    })
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message || 'Language change failed');
      }
      localStorage.setItem('plangId', id);
      localStorage.setItem('plangName', name);
      localStorage.setItem('plangCode', code);
      document.documentElement.lang = code;
      if (portalselectedlang) {
        portalselectedlang.innerText = name;
      }
      langModalClose();
      setTimeout(() => {
        window.location.reload();
      }, 400);
    })
    .catch((error) => {
      console.error('Error setting language:', error);
      portallangselectloader.classList.remove('flex');
      portallangselectloader.classList.add('hidden');
      portallang.classList.remove('hidden');
      alert(window.languageEr?.checkLang);
    });
}

if (portallangmodal) {
  portallangmodal.addEventListener('click', (e) => {
    if (e.target === portallangmodal) langModalClose();
  });
}
