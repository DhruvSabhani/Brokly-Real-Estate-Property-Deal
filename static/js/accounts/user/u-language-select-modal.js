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
  return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

uLangBtn.addEventListener('click', () => {
  uLangModal.classList.remove('hidden');
  uLangModal.classList.add('flex');

  setTimeout(() => {
    uLangModal.classList.remove('opacity-0');
    uLanguage.classList.remove('scale-95');
  }, 10);

  uLangSelectLoader.classList.replace('flex', 'hidden');
  uLanguage.classList.remove('hidden');
});

function uCloseLanguageModal() {
  setTimeout(() => {
    uLangModal.classList.remove('flex');
    uLangModal.classList.add('hidden');
  }, 300);

  uLangModal.classList.add('opacity-0');
  uLanguage.classList.add('scale-95');
}

function uSelectedLanguage(id, name, code) {
  localStorage.setItem('ulangId', id);
  localStorage.setItem('ulangName', name);
  localStorage.setItem('ulangCode', code);

  uLanguage.classList.add('hidden');
  uLangSelectLoader.classList.replace('hidden', 'flex');

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
      if (res.ok) {
        setTimeout(() => {
          uSelectedLang.innerText = name;
          uCloseLanguageModal();
        }, 500);
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error setting language:', error);
      uLangSelectLoader.classList.replace('flex', 'hidden');
      uLanguage.classList.remove('hidden');
      alert("{% trans 'Language change failed. Please try again.' %}");
    });
}

uLangModal.addEventListener('click', (e) => {
  if (e.target === uLangModal) uCloseLanguageModal();
});
