// filter list scroll icon show
const filterList = document.getElementById("filterList");
const leftScrollIcon = document.getElementById("leftScrollIcon");
const scrollFilterList = document.getElementById("scrollFilterList");
const rightScrollIcon = document.getElementById("rightScrollIcon");
// -------------------------------------------------------------------------------
// left side icon action
leftScrollIcon.addEventListener("click", (e) => {
    e.preventDefault();
    scrollFilterList.scrollBy({
        left: -300,
        behavior: "smooth",
    });
});
// right side icon action
rightScrollIcon.addEventListener("click", (e) => {
    e.preventDefault();
    scrollFilterList.scrollBy({
        left: 300,
        behavior: "smooth",
    });
});
// show scroll icon
function showScrollIcon(icon) {
    icon.classList.remove("hidden", "flex", "block", "grid");
    icon.classList.add("flex");
}
// hide scroll icon
function hideScrollIcon(icon) {
    icon.classList.remove("hidden", "flex", "block", "grid");
    icon.classList.add("hidden");
}
function updateScrollIcons() {
    const hasOverflow = scrollFilterList.scrollWidth > scrollFilterList.clientWidth;
    const atStart = scrollFilterList.scrollLeft <= 0;
    const atEnd = scrollFilterList.scrollLeft + scrollFilterList.clientWidth >= scrollFilterList.scrollWidth - 2;

    if (!hasOverflow) {
        hideScrollIcon(leftScrollIcon);
        hideScrollIcon(rightScrollIcon);
        return;
    }

    atStart ? hideScrollIcon(leftScrollIcon) : showScrollIcon(leftScrollIcon);
    atEnd ? hideScrollIcon(rightScrollIcon) : showScrollIcon(rightScrollIcon)
}

scrollFilterList.addEventListener("scroll", updateScrollIcons);
window.addEventListener("load", updateScrollIcons);
window.addEventListener("resize", updateScrollIcons);
