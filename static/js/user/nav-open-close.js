const ubody = document.getElementById('u-dashboard');
const sfix = document.getElementById('screen-fix');
const uNavBtn = document.getElementById('u-menu-btn');
const navbar = document.getElementById('navbar');
const umNavCloseBtn = document.getElementById('u-m-nav-close-btn');

function openNav() {
    ubody.classList.add("overflow-hidden", "scrollbar-hide");
    sfix.classList.remove('hidden');
    navbar.classList.remove('-translate-x-full');
}

function closeNav() {
    ubody.classList.remove("overflow-hidden", "scrollbar-hide");
    sfix.classList.add('hidden');
    navbar.classList.add('-translate-x-full');
}

uNavBtn?.addEventListener("click", openNav);
umNavCloseBtn?.addEventListener("click", closeNav);
sfix?.addEventListener("click", closeNav);