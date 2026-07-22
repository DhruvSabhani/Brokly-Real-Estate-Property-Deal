const logoutmodal = document.getElementById("logout-modal");

function openlogoutmodal({
    logbtnaction = null
}) {
    const logbtn = document.getElementById("log-mod-btn-text");
    logbtn.replaceWith(logbtn.cloneNode(true)); // Remove previous event listeners
    const newlogbtn = document.getElementById("log-mod-btn-text");
    newlogbtn.addEventListener("click", () => {
        if (typeof logbtnaction === "function") {
            logbtnaction();
        }
    });
    logoutmodal.classList.replace("hidden", "flex");
}

// close modal
function logoutmodelclose() {
    logoutmodal.classList.replace("flex", "hidden");
}

logoutmodal.addEventListener("click", (e) => {
    if (e.target === logoutmodal) logoutmodelclose();
});
