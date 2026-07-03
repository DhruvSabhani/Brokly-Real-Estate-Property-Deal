const main = document.getElementById('page-content');
const uNavBtn = document.getElementById('u-menu-btn');
const uNav = document.getElementById('u-navbar');
const umNavCloseBtn = document.getElementById('u-m-nav-close-btn');

uNavBtn.addEventListener('click', (e) => {
    e.preventDefault();
    uNav.classList.toggle('-translate-x-full');
})

main.addEventListener('click', () => {
    uNav.classList.add('-translate-x-full');
})

umNavCloseBtn.addEventListener('click', () => {
    uNav.classList.add('-translate-x-full');
})