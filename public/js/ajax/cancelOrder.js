const cancelOrderButtons = document.querySelectorAll(".cancel-order-btn");
let csrfToken;

const cancelOrder = async (event) => {
    const orderId = event.target.dataset.orderid;
    const csrf = event.target.dataset.csrftoken;
    let response;
    try {
        response = await fetch(`/orders/cancel?_csrf=${csrf}&orderId=${orderId}`, {
            method: "PATCH",
        });
    } catch(error) {
        return slowNetwork();
    }
    if(!response.ok) {
        return serverError();
    }
    const responseData = await response.json();
    if(!responseData.success) return showMessage(responseData.message, "The order can't be cancel because the order is not pending or not in a way to processing.");

    event.target.parentElement.querySelector(".order-status").innerText = "Cancel";
    event.target.parentElement.querySelector(".clear-order-btn").style.display = "inline";
    event.target.remove();
};

for(const cancelOrderButton of cancelOrderButtons) {
    cancelOrderButton.addEventListener("click", cancelOrder);
}
