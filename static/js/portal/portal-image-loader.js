const elements = {
  // nav image loader
  pImg: document.getElementById('pImg'),
  pImgLoader1: document.getElementById('pImgLoader1'),
  pImgLoader2: document.getElementById('pImgLoader2'),
  // header image loader
  pProfileBtn: document.getElementById('pProfileBtn'),
  pImgHead: document.getElementById('pImgHead'),
  pImgHeadLoader: document.getElementById('pImgHeadLoader'),
  pProfileMenu: document.getElementById('pProfileMenu'),
  // settings image loader
  pSetProfileImg: document.getElementById('pSetProfileImg'),
  pSetProfileImgLoad: document.getElementById('pSetProfileImgLoad'),
  // settings profile edit image loader
  pEditProfileImg: document.getElementById('pEditProfileImg'),
  pEditProfileImgLoad: document.getElementById('pEditProfileImgLoad'),
};

const DEFAULT_AVATAR = "{% static 'images/avatar.png' %}";

const showLoader = (loader) => {
  if (!loader) return;
  loader.classList.replace('hidden', 'flex');
};

const hideLoader = (loader) => {
  if (!loader) return;
  loader.classList.replace('flex', 'hidden');
};

function manageImageLoading(imgElement, loaders) {
  if (!imgElement) return;
  const loaderList = Array.isArray(loaders) ? loaders : [loaders];
  loaderList.forEach(showLoader);
  const clearLoaders = () => loaderList.forEach(hideLoader);
  if (imgElement.complete && imgElement.naturalWidth > 0) {
    clearLoaders();
  } else {
    imgElement.addEventListener('load', clearLoaders);
    imgElement.addEventListener('error', () => {
      clearLoaders();
      imgElement.src = DEFAULT_AVATAR;
    });
  }
}

manageImageLoading(elements.pImg, [elements.pImgLoader1, elements.pImgLoader2]);
manageImageLoading(elements.pImgHead, elements.pImgHeadLoader);
manageImageLoading(elements.pSetProfileImg, elements.pSetProfileImgLoad);
manageImageLoading(elements.pEditProfileImg, elements.pEditProfileImgLoad);
if (elements.pProfileBtn && elements.pProfileMenu) {
  elements.pProfileBtn.addEventListener('click', () => {
    elements.pProfileMenu.classList.toggle('opacity-0');
    elements.pProfileMenu.classList.toggle('scale-95');
    elements.pProfileMenu.classList.toggle('invisible');
  });
}
