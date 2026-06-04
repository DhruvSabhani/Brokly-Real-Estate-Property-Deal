// ----------  Broker side ------------
const bLangBtn = document.getElementById("bLanguageBtn");
const bSelectedLang = document.getElementById("bSelectedLanguage");
const bLangModal = document.getElementById("bLanguageModal");
const bLanguage = document.getElementById("bLanguage");
const bLangSelectLoader = document.getElementById("bLangSelectLoader");

if (!localStorage.getItem("blangCode")) {
  localStorage.setItem("blangId", "1");
  localStorage.setItem("blangName", "English");
  localStorage.setItem("blangCode", "en");
}

function getCSRF() {
  return document.querySelector("[name=csrfmiddlewaretoken]").value;
}

bLangBtn.addEventListener("click", () => {
  bLangModal.classList.remove("hidden");
  bLangModal.classList.add("flex");

  setTimeout(() => {
    bLangModal.classList.remove("opacity-0");
    bLanguage.classList.remove("scale-95");
  }, 10);

  bLangSelectLoader.classList.replace("flex", "hidden");
  bLanguage.classList.remove("hidden");
});

function bCloseLanguageModal() {
  setTimeout(() => {
    bLangModal.classList.remove("flex");
    bLangModal.classList.add("hidden");
  }, 300);

  bLangModal.classList.add("opacity-0");
  bLanguage.classList.add("scale-95");
}

function bSelectedLanguage(id, name, code) {
  localStorage.setItem("blangId", id);
  localStorage.setItem("blangName", name);
  localStorage.setItem("blangCode", code);

  bLanguage.classList.add("hidden");
  bLangSelectLoader.classList.replace("hidden", "flex");

  const formData = new FormData();
  formData.append("language", code);
  formData.append("panel", "broker");

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
          bSelectedLang.innerText = name;
          bCloseLanguageModal();
        }, 500);
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error setting language:", error);
      bLangSelectLoader.classList.replace("flex", "hidden");
      bLanguage.classList.remove("hidden");
      alert("{% trans 'Language change failed. Please try again.' %}");
    });
}

bLangModal.addEventListener("click", (e) => {
  if (e.target === bLangModal) bCloseLanguageModal();
});
