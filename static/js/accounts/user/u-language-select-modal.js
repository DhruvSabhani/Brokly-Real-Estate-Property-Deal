// ----------  User side ------------
const uLangBtn = document.getElementById('uLanguageBtn');
const uSelectedLang = document.getElementById('uSelectedLanguage');
const uLangModal = document.getElementById('uLanguageModal');
const uLanguage = document.getElementById('uLanguage');
const uLangSelectLoader = document.getElementById('uLangSelectLoader');

if (!localStorage.getItem('ulangCode')) {
  localStorage.setItem('ulangId', '1');
  localStorage.setItem('ulangName', 'English');
  localStorage.setItem('ulangCode', 'en');
}

document.documentElement.lang = localStorage.getItem('ulangCode');

function getCSRF() {
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
  return csrfToken ? csrfToken.value : '';
}

if (uLangBtn) {
  uLangBtn.addEventListener('click', () => {
    const userElement = document.getElementById('user');
    if (userElement) {
      userElement.classList.add('overflow-hidden', 'scrollbar-hide');
    }
    uLangModal.classList.remove('hidden');
    uLangModal.classList.add('flex');

    uLanguage.classList.remove('hidden');

    uLangSelectLoader.classList.remove('flex');
    uLangSelectLoader.classList.add('hidden');

    setTimeout(() => {
      uLangModal.classList.remove('opacity-0');
      uLanguage.classList.remove('scale-95');
    }, 10);
  });
}

function uCloseLanguageModal() {
  uLangModal.classList.add('opacity-0');
  uLanguage.classList.add('scale-95');

  setTimeout(() => {
    const userElement = document.getElementById('user');
    if (userElement) {
      userElement.classList.remove('overflow-hidden', 'scrollbar-hide');
    }
    uLangModal.classList.remove('flex');
    uLangModal.classList.add('hidden');
  }, 300);
}

function uSelectedLanguage(id, name, code) {
  if (uLangSelectLoader.classList.contains('flex')) {
    return;
  }

  uLanguage.classList.add('hidden');
  uLangSelectLoader.classList.remove('hidden');
  uLangSelectLoader.classList.add('flex');

  const formData = new FormData();
  formData.append('language', code);
  formData.append('panel', 'user');

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
        // setTimeout(() => {
        //   uSelectedLang.innerText = name;
        //   uCloseLanguageModal();
        // }, 500);
        // window.location.reload();
      }
      return res.json();
    })
    .then((data) => {
      if (!data.success) {
        throw new Error(data.message || 'Language change failed');
      }
      localStorage.setItem('ulangId', id);
      localStorage.setItem('ulangName', name);
      localStorage.setItem('ulangCode', code);
      document.documentElement.lang = code;
      if (uSelectedLang) {
        uSelectedLang.innerText = name;
      }
      uCloseLanguageModal();
      setTimeout(() => {
        window.location.reload();
      }, 400);
    })
    .catch((error) => {
      console.error('Error setting language:', error);
      uLangSelectLoader.classList.remove('flex');
      uLangSelectLoader.classList.add('hidden');
      uLanguage.classList.remove('hidden');
      alert(window.languageEr?.checkLang);
    });
}

if (uLangModal) {
  uLangModal.addEventListener('click', (e) => {
    if (e.target === uLangModal) uCloseLanguageModal();
  });
}
