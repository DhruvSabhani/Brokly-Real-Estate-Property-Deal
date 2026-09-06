// add property photo form
const addPhotoForm = document.getElementById('add-property-photos-form');
const addPhotoFormUrl = addPhotoForm.dataset.propertyPhotosStoreUrl;
// property photo container
const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
// 5MB limit calculated in bytes (5 * 1024 * 1024)
const max_file_size = 5242880;
const proPhotoInput = document.getElementById('proc-photo-input');
const photoViewContainer = document.getElementById('uploaded-photos-container');
// property photo modal
const proSelectPhotoModal = document.getElementById('proc-select-photos-modal');
const proPhotoModalTitle = document.getElementById('photo-modal-title');
const proPhotoModalClose = document.getElementById('photo-modal-close');
const proPhotoEditInput = document.getElementById('proc-photo-edit-input');
const proModalViewPhoto = document.getElementById('proc-selected-photo');
const proPhotoTitle = document.getElementById('proc-img-title');
// property photo modal btn
const proPhotoCancelBtn = document.getElementById('proc-photo-cancel-btn');
const proPhotoSkipBtn = document.getElementById('proc-photo-skip-btn');
const proPhotoTitleBtn = document.getElementById('proc-photo-title-btn');
// form btn
const propertyPhotosBtn = document.getElementById('property-photos-btn');
const loaderPhotosBtn = document.getElementById('loader-photos-btn');
loaderPhotosBtn.classList.remove('flex', 'opacity-100', 'scale-100');
loaderPhotosBtn.classList.add('hidden', 'opacity-0', 'scale-0');

let fileQueue = [];
let currentFileIndex = 0;
let selectFile = [];
let isEditMode = false;
let temporaryEditPhoto = null;

if (proPhotoInput) {
  proPhotoInput.addEventListener('change', async function (e) {
    if (!e.target.files.length) return;
    let rawFiles = Array.from(e.target.files);
    let incomingFiles = [];
    isEditMode = false;

    if (proPhotoModalTitle && proPhotoModalTitle.dataset.selectPhoto) {
      proPhotoModalTitle.innerText = proPhotoModalTitle.dataset.selectPhoto;
    }

    for (let file of rawFiles) {
      if (file.size > max_file_size) {
        alert(window.fieldProPhotosEr.maxPhotoSize + `: ${file.name}`);
        continue;
      }
      if (allowedFormats.includes(file.type)) {
        incomingFiles.push(file);
      } else {
        alert(window.fieldProPhotosEr.typeFormatsEr + `: ${file.name}`);
      }
    }

    let uniqueIncomingFiles = [];
    incomingFiles.forEach((file) => {
      const isAlreadySaved = selectFile.some((saved) => saved.file.name === file.name && saved.file.size === file.size);
      const isDuplicateInBatch = uniqueIncomingFiles.some(
        (queued) => queued.name === file.name && queued.size === file.size
      );
      if (isAlreadySaved || isDuplicateInBatch) {
        alert(window.fieldProPhotosEr.deplicatePhoto + `: ${file.name}`);
        return;
      }
      uniqueIncomingFiles.push(file);
    });
    if (selectFile.length + uniqueIncomingFiles.length > 10) {
      alert(window.fieldProPhotosEr.selectLimit);
      const remainingSlots = 10 - selectFile.length;
      uniqueIncomingFiles = uniqueIncomingFiles.slice(0, remainingSlots);
    }
    if (uniqueIncomingFiles.length === 0) {
      proPhotoInput.value = '';
      return;
    }

    fileQueue = uniqueIncomingFiles;
    currentFileIndex = 0;
    showNextPhoto();
    proPhotoInput.value = '';
  });
}

if (proPhotoEditInput) {
  proPhotoEditInput.addEventListener('change', async function (e) {
    if (!e.target.files.length) return;
    let selectedFile = e.target.files[0];
    document.getElementById('proc-photo-error').innerText = '';
    const isDuplicate = selectFile.some((saved, index) => {
      if (index === currentFileIndex) return false;
      return saved.file.name === selectedFile.name && saved.file.size === selectedFile.size;
    });
    if (isDuplicate) {
      document.getElementById('proc-photo-error').innerText = window.fieldProPhotosEr.deplicatePhoto;
      this.value = '';
      return;
    }
    if (selectedFile.size > max_file_size) {
      document.getElementById('proc-photo-error').innerText = window.fieldProPhotosEr.maxPhotoSize;
      this.value = '';
      return;
    }
    if (!allowedFormats.includes(selectedFile.type)) {
      document.getElementById('proc-photo-error').innerText = window.fieldProPhotosEr.typeFormatsEr;
      this.value = '';
      return;
    }
    temporaryEditPhoto = selectedFile;

    if (proModalViewPhoto.src.startsWith('blob:')) URL.revokeObjectURL(proModalViewPhoto.src);
    proModalViewPhoto.src = URL.createObjectURL(selectedFile);

    proPhotoTitleBtn.disabled = false;
    proPhotoTitleBtn.classList.replace('text-gray-500/50', 'text-orange-500');
    this.value = '';
  });
}

if (proPhotoTitle) {
  proPhotoTitle.addEventListener('input', function () {
    const currentTitle = this.value.trim();
    if (currentTitle === '') {
      proPhotoTitleBtn.disabled = true;
      proPhotoTitleBtn.classList.replace('text-orange-500', 'text-gray-500/50');
      return;
    }
    if (isEditMode) {
      const originalItem = selectFile[currentFileIndex];
      if (currentTitle !== originalItem.title || temporaryEditPhoto !== null) {
        proPhotoTitleBtn.disabled = false;
        proPhotoTitleBtn.classList.replace('text-gray-500/50', 'text-orange-500');
      } else {
        proPhotoTitleBtn.disabled = true;
        proPhotoTitleBtn.classList.replace('text-orange-500', 'text-gray-500/50');
      }
    } else {
      proPhotoTitleBtn.disabled = false;
      proPhotoTitleBtn.classList.replace('text-gray-500/50', 'text-orange-500');
    }
  });
}

// photo cancel btn(select photo delete and next show photo)
if (proPhotoCancelBtn) {
  proPhotoCancelBtn.addEventListener('click', function () {
    if (isEditMode) {
      photoModalClose();
      return;
    }
    currentFileIndex++;
    showNextPhoto();
  });
}

// photo skip btn(select photo skip and next show photo)
if (proPhotoSkipBtn) {
  proPhotoSkipBtn.addEventListener('click', function () {
    if (isEditMode) {
      selectFile[currentFileIndex].title = '';
      currentFileIndex = fileQueue.length;
      showNextPhoto();
      return;
    }
    if (selectFile.length < 10) {
      const currentFile = fileQueue[currentFileIndex];
      selectFile.push({ file: currentFile, title: '' });
      currentFileIndex++;
      showNextPhoto();
    } else {
      alert(window.fieldProPhotosEr.uploadLimit);
      photoModalClose();
    }
  });
}

// photo title save btn
if (proPhotoTitleBtn) {
  proPhotoTitleBtn.addEventListener('click', function () {
    const currentTitle = proPhotoTitle.value.trim();
    if (isEditMode) {
      if (currentFileIndex !== null && currentFileIndex !== undefined) {
        if (temporaryEditPhoto) {
          selectFile[currentFileIndex].file = temporaryEditPhoto;
        }
        selectFile[currentFileIndex].title = currentTitle;
        currentFileIndex = fileQueue.length;
        showNextPhoto();
      }
      return;
    }

    if (selectFile.length < 10) {
      selectFile.push({
        file: fileQueue[currentFileIndex],
        title: currentTitle,
      });
      currentFileIndex++;
      showNextPhoto();
    } else {
      alert(window.fieldProPhotosEr.uploadLimit);
      photoModalClose();
    }
  });
}

function showNextPhoto() {
  if (currentFileIndex >= fileQueue.length) {
    if (selectFile.length === 0) {
      photoModalClose();
      document.getElementById('uploaded-photos-count').innerText = selectFile.length;
      photoViewContainer.innerHTML = '';
      return;
    }
    document.getElementById('uploaded-photos-count').innerText = selectFile.length;
    const allPhotosHtml = selectFile
      .map((item, index) => {
        const coverPhotoUrl = URL.createObjectURL(item.file);
        const coverPhotoHtml =
          index === 0
            ? `<span class="absolute top-1 left-1 text-sm rounded-xl bg-orange-400 text-white px-2 leading-tight flex justify-center items-center">${window.fieldProPhotosEr.coverPhoto}</span>`
            : '';
        const photoTitleHtml =
          item.title !== ''
            ? `<h1 class="absolute bottom-0 left-0 px-2 bg-white text-black font-medium rounded-lg text-xs max-w-full h-5 flex justify-start items-center"><span class="truncate">${item.title}</span></h1>`
            : '';
        return `
        <div data-index="${index}" draggable="true" class="proc-photo-box draggable-tile relative flex justify-center items-center w-full h-34 aspect-square rounded-xl gap-x-2 gap-y-2 bg-black/3 dark:bg-white/3 cursor-grab active:cursor-grabbing group transition-all duration-200">
        ${coverPhotoHtml}
        <img src="${coverPhotoUrl}" alt="${item.title}" id="proc-photo-view" class="w-full h-full object-contain rounded-xl transition-transform duration-200 group-hover:scale-105 pointer-events-none">
        <button type="button" data-index="${index}" class="proc-photo-delete absolute top-1 right-1 w-10 h-10 z-20 flex justify-center items-center bg-white text-black rounded-full" onclick="event.stopPropagation();">
        <svg xmlns="{% static 'icons/x.svg' %}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        </button>
        ${photoTitleHtml}
        </div>
        `;
      })
      .join('');

    photoViewContainer.innerHTML = allPhotosHtml;
    showPhotoDelete();
    showPhotoEdit();
    steupDragAndDropReorder();
    photoModalClose();
    return;
  }
  document.querySelector('label[for="proc-photo-edit-input"]').classList.remove('opacity-100', 'scale-100', 'flex');
  document.querySelector('label[for="proc-photo-edit-input"]').classList.add('opacity-0', 'scale-95', 'hidden');

  if (proPhotoCancelBtn) {
    proPhotoCancelBtn.classList.remove('hidden', 'opacity-0', 'scale-95');
    proPhotoCancelBtn.classList.add('flex', 'opacity-100', 'scale-100');
  }
  if (proPhotoSkipBtn) {
    proPhotoSkipBtn.classList.remove('hidden', 'opacity-0', 'scale-95');
    proPhotoSkipBtn.classList.add('flex', 'opacity-100', 'scale-100');
  }

  pbody.classList.add('overflow-hidden', 'scrollbar-hide');
  proSelectPhotoModal.classList.replace('hidden', 'flex');

  if (proPhotoTitleBtn) {
    proPhotoTitleBtn.classList.remove('hidden', 'opacity-0', 'scale-95');
    proPhotoTitleBtn.classList.add('flex', 'opacity-100', 'scale-100');
  }

  document.getElementById('proc-photo-error').innerText = '';
  proPhotoTitle.value = '';
  proPhotoTitle.focus();

  proPhotoTitleBtn.disabled = true;
  proPhotoTitleBtn.classList.replace('text-orange-500', 'text-gray-500/50');

  if (proModalViewPhoto.src.startsWith('blob:')) URL.revokeObjectURL(proModalViewPhoto.src);
  proModalViewPhoto.src = URL.createObjectURL(fileQueue[currentFileIndex]);
}

function showPhotoDelete() {
  document.querySelectorAll('.proc-photo-delete').forEach((btn) => {
    btn.addEventListener('click', function () {
      const idIndex = parseInt(this.getAttribute('data-index'), 10);
      selectFile.splice(idIndex, 1);
      currentFileIndex = fileQueue.length;
      showNextPhoto();
    });
  });
}

function showPhotoEdit() {
  document.querySelectorAll('.proc-photo-box').forEach((btn) => {
    btn.addEventListener('click', function () {
      currentFileIndex = parseInt(this.getAttribute('data-index'), 10);
      isEditMode = true;

      const targetItem = selectFile[currentFileIndex];
      fileQueue = [targetItem.file];

      document.querySelector('label[for="proc-photo-edit-input"]').classList.remove('opacity-0', 'scale-95', 'hidden');
      document.querySelector('label[for="proc-photo-edit-input"]').classList.add('opacity-100', 'scale-100', 'flex');

      if (proPhotoCancelBtn) {
        proPhotoCancelBtn.classList.remove('flex', 'opacity-100', 'scale-100');
        proPhotoCancelBtn.classList.add('hidden', 'opacity-0', 'scale-95');
      }
      if (proPhotoSkipBtn) {
        proPhotoSkipBtn.classList.remove('flex', 'opacity-100', 'scale-100');
        proPhotoSkipBtn.classList.add('hidden', 'opacity-0', 'scale-95');
      }

      pbody.classList.add('overflow-hidden', 'scrollbar-hide');
      proSelectPhotoModal.classList.replace('hidden', 'flex');

      if (proPhotoModalTitle && proPhotoModalTitle.dataset.editPhoto) {
        proPhotoModalTitle.innerText = proPhotoModalTitle.dataset.editPhoto;
      }
      document.getElementById('proc-photo-error').innerText = '';
      proPhotoTitle.value = targetItem.title || '';
      proPhotoTitle.focus();
      temporaryEditPhoto = null;

      if (proPhotoTitle.value.trim() !== '') {
        proPhotoTitleBtn.disabled = false;
        proPhotoTitleBtn.classList.replace('text-gray-500/50', 'text-orange-500');
      } else {
        proPhotoTitleBtn.disabled = true;
        proPhotoTitleBtn.classList.replace('text-orange-500', 'text-gray-500/50');
      }

      if (proModalViewPhoto.src.startsWith('blob:')) URL.revokeObjectURL(proModalViewPhoto.src);
      proModalViewPhoto.src = URL.createObjectURL(targetItem.file);
    });
  });
}

function photoModalClose() {
  pbody.classList.remove('overflow-hidden', 'scrollbar-hide');
  if (proSelectPhotoModal) proSelectPhotoModal.classList.replace('flex', 'hidden');
  proPhotoInput.value = '';
  document.getElementById('proc-photo-error').innerText = '';
  if (proModalViewPhoto.src.startsWith('blob:')) {
    URL.revokeObjectURL(proModalViewPhoto.src);
    proModalViewPhoto.src = '';
  }
  fileQueue = [];
  currentFileIndex = 0;
  isEditMode = false;
  temporaryEditPhoto = null;
}

if (proPhotoModalClose) proPhotoModalClose.addEventListener('click', photoModalClose);

proSelectPhotoModal.addEventListener('click', function (e) {
  if (e.target === proSelectPhotoModal) photoModalClose();
});

function steupDragAndDropReorder() {
  const tiles = document.querySelectorAll('.draggable-tile');
  let draggedItemIndex = null;

  tiles.forEach((tile) => {
    tile.addEventListener('dragstart', function (e) {
      draggedItemIndex = parseInt(this.getAttribute('data-index'), 10);
      this.classList.add('opacity-40', 'scale-95');
      e.dataTransfer.effectAllowed = 'move';
    });

    tile.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      this.classList.add('border', 'border-orange-400', 'ring-2', 'ring-orange-100');
    });

    tile.addEventListener('dragleave', function () {
      this.classList.remove('border', 'border-orange-400', 'ring-2', 'ring-orange-100');
    });

    tile.addEventListener('drop', function (e) {
      e.preventDefault();
      this.classList.remove('border', 'border-orange-400', 'ring-2', 'ring-orange-100');
      const targetItemIndex = parseInt(this.getAttribute('data-index'), 10);
      if (draggedItemIndex !== null && draggedItemIndex !== targetItemIndex) {
        const [movedItem] = selectFile.splice(draggedItemIndex, 1);
        selectFile.splice(targetItemIndex, 0, movedItem);
        currentFileIndex = fileQueue.length;
        showNextPhoto();
      }
    });
    tile.addEventListener('dragend', function () {
      this.classList.remove('opacity-40', 'scale-95');
      draggedItemIndex = null;
    });
  });
}

function photosFormClear() {
  fileQueue = [];
  currentFileIndex = 0;
  selectFile = [];
  isEditMode = false;
  temporaryEditPhoto = null;
  addPhotoForm.reset();
  proPhotoInput.value = '';
  proModalViewPhoto.src = '';
  proPhotoEditInput.value = '';
  proPhotoTitle.innerText = '';
  photoViewContainer.innerHTML = '';
  showNextPhoto();
}

addPhotoForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  loaderPhotosBtn.classList.remove('hidden', 'opacity-0', 'scale-0');
  loaderPhotosBtn.classList.add('flex', 'opacity-100', 'scale-100');

  const fd = new FormData();
  selectFile.forEach((item) => {
    fd.append('prophotos', item.file);
    fd.append('prophototitles', item.title);
  });

  try {
    const response = await fetch(addPhotoFormUrl, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCSRF(),
      },
      body: fd,
    });

    const data = await response.json();
    if (data.error) {
      alert(data.message);
      loaderPhotosBtn.classList.remove('flex', 'opacity-100', 'scale-100');
      loaderPhotosBtn.classList.add('hidden', 'opacity-0', 'scale-0');
      return;
    }
    if (data.success) {
      loaderPhotosBtn.classList.remove('flex', 'opacity-100', 'scale-100');
      loaderPhotosBtn.classList.add('hidden', 'opacity-0', 'scale-0');

      const step2El = document.getElementById('step-2');
      if (step2El) {
        if (data.stepcomplete) step2El.classList.add(data.stepcomplete);
        step2El.innerHTML = `<svg xmlns="{% static 'icons/check.svg' %}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check text-white"><path d="M20 6 9 17l-5-5"/></svg>`;
      }
      const step2NameEl = document.getElementById('step-2-name');
      if (step2NameEl && data.stepcomplete) {
        step2NameEl.classList.add(data.stepcomplete);
      }

      const step2CompleteEl = document.getElementById('step-2-complete');
      if (step2CompleteEl) {
        step2CompleteEl.classList.replace('bg-red-300/30', 'bg-[#ff6b00]');
      }
      isPropertyCreated = true;
      nextStep();
      if (typeof loadPropertyReview === 'function') {
        loadPropertyReview();
      }
    }
  } catch (error) {
    console.log(error);
    alert(window.allError?.tryAgain);
    if (loaderPhotosBtn) {
      loaderPhotosBtn.classList.remove('flex', 'opacity-100', 'scale-100');
      loaderPhotosBtn.classList.add('hidden', 'opacity-0', 'scale-0');
    }
  }
});
