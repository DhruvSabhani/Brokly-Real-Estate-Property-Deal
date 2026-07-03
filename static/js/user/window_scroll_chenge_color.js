// window scroll chenge color
window.addEventListener('scroll', function () {
    const uNavbar = document.getElementById('u-navbar');
    const dasktopHeader = document.getElementById('dasktopHeader');
    const mobileHeader = document.getElementById('mobileHeader');
    if (window.scrollY > 10) {
        // nav bar
        uNavbar.classList.replace('lg:bg-transparent', 'lg:bg-[#ffffff]');
        uNavbar.classList.replace('lg:dark:bg-transparent', 'lg:dark:bg-[#0e0d0d]');
        // dasktop header
        dasktopHeader.classList.replace('bg-[#f7f9fc]', 'bg-[#ffffff]');
        dasktopHeader.classList.replace('dark:bg-[#121212]', 'dark:bg-[#0e0d0d]');
        // mobile header
        mobileHeader.classList.replace('bg-[#f7f9fc]', 'bg-[#ffffff]');
        mobileHeader.classList.replace('dark:bg-[#121212]', 'dark:bg-[#0e0d0d]');
    } else {
        // nav bar
        uNavbar.classList.replace('lg:bg-[#ffffff]', 'lg:bg-transparent');
        uNavbar.classList.replace('lg:dark:bg-[#0e0d0d]', 'lg:dark:bg-transparent');
        // dasktop header
        dasktopHeader.classList.replace('bg-[#ffffff]', 'bg-[#f7f9fc]');
        dasktopHeader.classList.replace('dark:bg-[#0e0d0d]', 'dark:bg-[#121212]');
        // mobile header
        mobileHeader.classList.replace('bg-[#ffffff]', 'bg-[#f7f9fc]');
        mobileHeader.classList.replace('dark:bg-[#0e0d0d]', 'dark:bg-[#121212]');
    }
})