const getAddressButtons = document.querySelectorAll(".get-address");
const hideAddressButtons = document.querySelectorAll(".hide-address");
let csrfToken;

const getUserInfoForOrder = async (event) => {
    const clickedBtn = event.target;
    const orderId = clickedBtn.dataset.orderid;
    let response;
    try {
        response = await fetch(`/admin/orders/user?orderId=${orderId}`);
    } catch(error) {
        return slowNetwork();
    }

    if(!response.ok) {
        return serverError();
    }

    const responseData = await response.json();
    const { user } = responseData;
    csrfToken = responseData.csrfToken;
    const userInfoBox = clickedBtn.parentElement.querySelector(".user-info-section");
    userInfoBox.innerHTML = `
        <h2>User Info</h2>
        <hr />
        <p>Name - ${user?.name}</p>
        <p>Email - ${user?.email}</p>
        <h2>Address</h2>
        <hr />
        <p>Milestone - ${user?.address?.milestone}</p>
        <p>Street Number - ${user?.address?.streetNumber}</p>
        <p>Postal Code - ${user?.address?.postalCode}</p>
        <p>City - ${user?.address?.city}</p>
        <p>Country - ${user?.address?.country}</p>
    `;
    userInfoBox.style.display = "block";
    clickedBtn.style.display = "none";
    clickedBtn.parentElement.querySelector(".hide-address").style.display = "inline";
};

const hideUserInfo = (event) => {
    const clickedBtn = event.target;
    clickedBtn.parentElement.querySelector(".user-info-section").innerHTML = "";
    clickedBtn.parentElement.querySelector(".user-info-section").style.display = "none";
    clickedBtn.parentElement.querySelector(".get-address").style.display = "inline";
    clickedBtn.style.display = "none";
};

for(const getAddressButton of getAddressButtons)
    getAddressButton.addEventListener("click", getUserInfoForOrder);

for(const hideAddressButton of hideAddressButtons)
    hideAddressButton.addEventListener("click", hideUserInfo);
