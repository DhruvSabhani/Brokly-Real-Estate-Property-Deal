// nav image loader
const uimg = document.getElementById('uImg')
const uimgloader1 = document.getElementById('uImgLoader1')
const uimgloader2 = document.getElementById('uImgLoader2')
// header image loader
const uprofilebtn = document.getElementById('uProfileBtn')
const uimgHead = document.getElementById('uImgHead')
const uimgHeadloader = document.getElementById('uImgHeadLoader')
const uprofilemenu = document.getElementById('uProfileMenu')
// ----------------------------------------------------------------------------------------------------------------------------------
// show loader
function showLoader(loader) {
    loader.classList.remove('hidden')
    loader.classList.add('flex')
}
// hide loader
function hideLoader(loader) {
    loader.classList.remove('flex')
    loader.classList.add('hidden')
}

// nav image loader
showLoader(uimgloader1)
showLoader(uimgloader2)
if (uimg.complete) {
    hideLoader(uimgloader1)
    hideLoader(uimgloader2)
} else {
    uimg.onload = () => {
        hideLoader(uimgloader1)
        hideLoader(uimgloader2)
    }

    uimg.onerror = () => {
        hideLoader(uimgloader1)
        hideLoader(uimgloader2)
        uimg.src = "{% static 'images/avatar.png' %}"
    }
}

// header image loader
showLoader(uimgHeadloader);
if (uimgHead.complete) {
    hideLoader(uimgHeadloader);
} else {
    uimgHead.onload = () => {
        hideLoader(uimgHeadloader);
    }
    uimgHead.onerror = () => {
        hideLoader(uimgHeadloader);
        uimgHead.src = "{% static 'images/avatar.png' %}";
    }
}
uprofilebtn.addEventListener('click', () => {
    uprofilemenu.classList.toggle('opacity-0');
    uprofilemenu.classList.toggle('scale-95');
    uprofilemenu.classList.toggle('invisible');
});
