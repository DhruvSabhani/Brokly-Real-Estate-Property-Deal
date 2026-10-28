const elements = {
  // nav image loader
  uImg: document.getElementById('uImg'),
  uImgLoader1: document.getElementById('uImgLoader1'),
  uImgLoader2: document.getElementById('uImgLoader2'),
  // header image loader
  uProfileBtn: document.getElementById('uProfileBtn'),
  uImgHead: document.getElementById('uImgHead'),
  uImgHeadLoader: document.getElementById('uImgHeadLoader'),
  uProfileMenu: document.getElementById('uProfileMenu'),
  // settings image loader
  uSetProfileImg: document.getElementById('uSetProfileImg'),
  uSetProfileImgLoad: document.getElementById('uSetProfileImgLoad'),
  // settings profile edit image loader
  uEditProfileImg: document.getElementById('uEditProfileImg'),
  uEditProfileImgLoad: document.getElementById('uEditProfileImgLoad'),
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

manageImageLoading(elements.uImg, [elements.uImgLoader1, elements.uImgLoader2]);
manageImageLoading(elements.uImgHead, elements.uImgHeadLoader);
manageImageLoading(elements.uSetProfileImg, elements.uSetProfileImgLoad);
manageImageLoading(elements.uEditProfileImg, elements.uEditProfileImgLoad);
if (elements.uProfileBtn && elements.uProfileMenu) {
  elements.uProfileBtn.addEventListener('click', () => {
    elements.uProfileMenu.classList.toggle('opacity-0');
    elements.uProfileMenu.classList.toggle('scale-95');
    elements.uProfileMenu.classList.toggle('invisible');
  });
}


