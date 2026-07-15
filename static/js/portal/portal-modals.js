const pModal = document.getElementById("p-modal");

// open modal
function pOpenModal({
    mTitle = "",
    icon = "",
    title = "",
    message = "",
    btnText = "",
    btnAction = null
}) {
    document.getElementById("pModalTitle").innerText = mTitle;
    document.getElementById("pModalIcon").innerHTML = icon;
    document.getElementById("pTitle").innerText = title;
    document.getElementById("pMessage").innerText = message;
    document.getElementById("pModalBtnText").innerText = btnText;

    const btn = document.getElementById("pModalBtnText");
    btn.replaceWith(btn.cloneNode(true)); // Remove previous event listeners
    const newBtn = document.getElementById("pModalBtnText");
    newBtn.addEventListener("click", () => {
        if (typeof btnAction === "function") {
            btnAction();
        }
    });
    // pbody.classList.add("overflow-hidden", "scrollbar-hide");
    pModal.classList.replace("hidden", "flex");
}

// close modal
function uCloseModal() {
    // pbody.classList.remove("overflow-hidden", "scrollbar-hide");
    pModal.classList.replace("flex", "hidden");
}

pModal.addEventListener("click", (e) => {
    if (e.target === pModal) uCloseModal();
});
