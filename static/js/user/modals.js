const uModal = document.getElementById("uModal");

// open modal
function uOpenModal({
    mTitle = "",
    icon = "",
    title = "",
    message = "",
    btnText = "",
    btnAction = null
}) {
    document.getElementById("uModalTitle").innerText = mTitle;
    document.getElementById("uModalIcon").innerHTML = icon;
    document.getElementById("uTitle").innerText = title;
    document.getElementById("uMessage").innerText = message;
    document.getElementById("uModalBtnText").innerText = btnText;

    const btn = document.getElementById("uModalBtnText");
    btn.replaceWith(btn.cloneNode(true)); // Remove previous event listeners
    const newBtn = document.getElementById("uModalBtnText");
    newBtn.addEventListener("click", () => {
        if (typeof btnAction === "function") {
            btnAction();
        }
    });
    uModal.classList.replace("hidden", "flex");
}

// close modal
function uCloseModal() {
    uModal.classList.replace("flex", "hidden");
}

uModal.addEventListener("click", (e) => {
    if (e.target === uModal) uCloseModal();
});
