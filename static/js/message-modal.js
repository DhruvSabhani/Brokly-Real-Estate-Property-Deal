const messagemodal = document.getElementById("message-modal");
const messtitle = document.getElementById("mess-mod-title");
const messmessage = document.getElementById("mess-mod-message");
const messpositivebtn = document.getElementById("mess-mod-posi-btn");

messagemodal.classList.remove("flex", "block", "hidden");
messagemodal.classList.add("hidden");

function openmessagemodal({
    messmodtitle = "",
    messmodmessage = "",
    messmodposibtn = "",
    messmodposibtnaction = () => { }
}) {
    messtitle.innerText = messmodtitle;
    messmessage.innerText = messmodmessage;
    messpositivebtn.innerText = messmodposibtn;

    messpositivebtn.onclick = null;

    messpositivebtn.onclick = () => {
        messmodposibtnaction();
        messagemodelclose();
    };

    messagemodal.classList.remove("flex", "block", "hidden");
    messagemodal.classList.add("flex");
}

// close modal
function messagemodelclose() {
    messagemodal.classList.remove("flex", "block", "hidden");
    messagemodal.classList.add("hidden");
}

messagemodal.addEventListener("click", (e) => {
    if (e.target === messagemodal) messagemodelclose();
});
