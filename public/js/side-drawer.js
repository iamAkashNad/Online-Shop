const hamburgerButton = document.getElementById("hamburger-icon");
const sideDrawer = document.getElementById("side-drawer");

const showSideDrawer = () => {
    sideDrawer.classList.toggle("on");
};

hamburgerButton.addEventListener("click", showSideDrawer);
