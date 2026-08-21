// nav image loader
const pimg = document.getElementById('pImg');
const pimgloader1 = document.getElementById('pImgLoader1');
const pimgloader2 = document.getElementById('pImgLoader2');
// header image loader
const pprofilebtn = document.getElementById('pProfileBtn');
const pimgHead = document.getElementById('pImgHead');
const pimgHeadloader = document.getElementById('pImgHeadLoader');
const pprofilemenu = document.getElementById('pProfileMenu');
// ---------------------------------------------------------------------------------------
// show loader
function showLoader(loader) {
  loader.classList.remove('hidden');
  loader.classList.add('flex');
}
// hide loader
function hideLoader(loader) {
  loader.classList.remove('flex');
  loader.classList.add('hidden');
}

// nav image loader
showLoader(pimgloader1);
showLoader(pimgloader2);
if (pimg.complete) {
  hideLoader(pimgloader1);
  hideLoader(pimgloader2);
} else {
  pimg.onload = () => {
    hideLoader(pimgloader1);
    hideLoader(pimgloader2);
  };

  pimg.onerror = () => {
    hideLoader(pimgloader1);
    hideLoader(pimgloader2);
    pimg.src = "{% static 'images/avatar.png' %}";
  };
}

// header image loader
showLoader(pimgHeadloader);
if (pimgHead.complete) {
  hideLoader(pimgHeadloader);
} else {
  pimgHead.onload = () => {
    hideLoader(pimgHeadloader);
  };
  pimgHead.onerror = () => {
    hideLoader(pimgHeadloader);
    pimgHead.src = "{% static 'images/avatar.png' %}";
  };
}
pprofilebtn.addEventListener('click', () => {
  pprofilemenu.classList.toggle('opacity-0');
  pprofilemenu.classList.toggle('scale-95');
  pprofilemenu.classList.toggle('invisible');
});
