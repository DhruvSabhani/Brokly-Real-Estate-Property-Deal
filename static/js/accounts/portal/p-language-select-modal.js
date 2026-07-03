// ----------  Portal side ------------
const pLangBtn = document.getElementById("pLanguageBtn");
const pSelectedLang = document.getElementById("pSelectedLanguage");
const pLangModal = document.getElementById("pLanguageModal");
const pLanguage = document.getElementById("pLanguage");
const pLangSelectLoader = document.getElementById("pLangSelectLoader");

if (!localStorage.getItem("plangCode")) {
  localStorage.setItem("plangId", "1");
  localStorage.setItem("plangName", "English");
  localStorage.setItem("plangCode", "en");
}

function getCSRF() {
  return document.querySelector("[name=csrfmiddlewaretoken]").value;
}

pLangBtn.addEventListener("click", () => {
  pLangModal.classList.remove("hidden");
  pLangModal.classList.add("flex");

  setTimeout(() => {
    pLangModal.classList.remove("opacity-0");
    pLanguage.classList.remove("scale-95");
  }, 10);

  pLangSelectLoader.classList.replace("flex", "hidden");
  pLanguage.classList.remove("hidden");
});

function pCloseLanguageModal() {
  setTimeout(() => {
    pLangModal.classList.remove("flex");
    pLangModal.classList.add("hidden");
  }, 300);

  pLangModal.classList.add("opacity-0");
  pLanguage.classList.add("scale-95");
}

function pSelectedLanguage(id, name, code) {
  localStorage.setItem("plangId", id);
  localStorage.setItem("plangName", name);
  localStorage.setItem("plangCode", code);

  pLanguage.classList.add("hidden");
  pLangSelectLoader.classList.replace("hidden", "flex");

  const formData = new FormData();
  formData.append("language", code);
  formData.append("panel", "portal");

  fetch("/change-language/", {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRF(),
    },
    body: formData,
    credentials: "same-origin",
  })
    .then((res) => {
      if (res.ok) {
        setTimeout(() => {
          pSelectedLang.innerText = name;
          pCloseLanguageModal();
        }, 500);
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error setting language:", error);
      pLangSelectLoader.classList.replace("flex", "hidden");
      pLanguage.classList.remove("hidden");
      alert("{% trans 'Language change failed. Please try again.' %}");
    });
}

pLangModal.addEventListener("click", (e) => {
  if (e.target === pLangModal) pCloseLanguageModal();
});
