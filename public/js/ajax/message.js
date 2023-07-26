const messgaeBox = document.getElementById("message-box");
const backDrop = document.getElementById("back-drop");

const showBox = () => {
    messgaeBox.style.display = "block";
    backDrop.style.display = "block";
};

const getBoxFooter = () => {
    return (`<p style="margin-top: 1.2rem;">
        <p style="margin-bottom: 0.3rem; font-size: 0.9rem;">wCart</p>
        <p style="margin-top: 0.3rem; font-size: 0.9rem;">(c) All Copyright Reserved.</p>
    </p>`);
}

const slowNetwork = () => {
    messgaeBox.innerHTML = `
        <h2>Network Connection Interrupt!</h2>
        <p>Please make sure that you are connected to a stable internet connection.</p>
        ${getBoxFooter()}
    `;
    showBox();
};

const notFound = () => {
    messgaeBox.innerHTML = `
        <h2>Resource not Found!</h2>
        <p>Seems like the resource you want to access is not found in the server. Make sure that you doesn't do any typo.</p>
        ${getBoxFooter()}
    `;
    showBox();
};

const serverError = () => {
    messgaeBox.innerHTML = `
        <h2>Something went wrong internally!</h2>
        <p>On our server, It's seems like something doesn't work. Stay tuned...We are trying fix it as soon as possible.</p>
        ${getBoxFooter()}
    `;
    showBox();
};

const showMessage = (header, body) => {
    messgaeBox.innerHTML = `
        <h2>${header}</h2>
        <p>${body}</p>
        ${getBoxFooter()}
    `;
    showBox();
};

const hideBox = () => {
    messgaeBox.style.display = "none";
    backDrop.style.display = "none";
};

messgaeBox.addEventListener("click", hideBox);
backDrop.addEventListener("click", hideBox);
