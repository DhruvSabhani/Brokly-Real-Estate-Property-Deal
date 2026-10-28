// filter list scroll icon show
const filterList = document.getElementById('filterLists');
const leftScrollIcon = document.getElementById('leftScrollIcon');
const scrollFilterList = document.getElementById('scrollFilterList');
const rightScrollIcon = document.getElementById('rightScrollIcon');

const toggleIconVisibility = (icon, isVisible) => {
  if (!icon) return;
  isVisible ? icon.classList.replace('hidden', 'flex') : icon.classList.replace('flex', 'hidden');
};

function updateScrollIcons() {
  if (!scrollFilterList) return;
  const { scrollWidth, clientWidth, scrollLeft } = scrollFilterList;
  const hasOverflow = scrollWidth > clientWidth;

  if (!hasOverflow) {
    toggleIconVisibility(leftScrollIcon, false);
    toggleIconVisibility(rightScrollIcon, false);
    return;
  }
  const atStart = scrollLeft <= 2;
  const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;

  toggleIconVisibility(leftScrollIcon, !atStart);
  toggleIconVisibility(rightScrollIcon, !atEnd);
}

if (scrollFilterList) {
  leftScrollIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollFilterList.scrollBy({ left: -300, behavior: 'smooth' });
  });

  rightScrollIcon?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollFilterList.scrollBy({ left: 300, behavior: 'smooth' });
  });

  scrollFilterList.addEventListener('scroll', updateScrollIcons);
  window.addEventListener('resize', updateScrollIcons);
  window.addEventListener('load', updateScrollIcons);

  updateScrollIcons();
}
