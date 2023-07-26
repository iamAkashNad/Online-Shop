const updateOrderStatusForms = document.querySelectorAll(".order-status-form");

const updateOrderStatus = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        orderId: formData.get("orderId"),
        status: formData.get("status"),
        _csrf: csrfToken || formData.get("csrf")
    };

    let response;
    try {
        response = await fetch(`/admin/order/status/update`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch(error) {
        return slowNetwork();
    }

    if(!response.ok) {
        if(response.status === 400) return showMessage("Please check your submitted data again", "Seems like the data you send for updation is not correct/acceptable.");
        return serverError();
    }

    const responseData = await response.json();
    if(!responseData.success) return showMessage(responseData.message, "Either the order isb't found for that order id or The status of that order is not pending");

    const orderStatus = event.target.parentElement.querySelector(".order-status-span");
    orderStatus.innerText = responseData.status;
    orderStatus.style.display = "inline";
    if(responseData.status === "Cancel") 
        event.target.parentElement.querySelector(".clear-order-btn").style.display = "inline";
    event.target.style.display = "none";
};

for(const updateOrderStatusForm of updateOrderStatusForms)
    updateOrderStatusForm.addEventListener("submit", updateOrderStatus);
