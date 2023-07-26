const clearOrderBtns = document.querySelectorAll(".clear-order-btn");

const clearOrder = async (event) => {
    const clickedButton = event.target;
    const csrf = csrfToken || clickedButton.dataset.csrftoken;
    const orderId = clickedButton.dataset.orderid;
    const url = clickedButton.dataset.url;
    const data = { orderId, _csrf: csrf };

    let response;
    try {
        response = await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        });
    } catch(error) {
        return slowNetwork();
    }

    if(!response.ok) return serverError();

    const responseData = await response.json();

    if(!responseData.success) return showMessage(responseData.message);
    clickedButton.closest(".order-item").remove();
    if(responseData.orderCount === 0) {
        const oneTimeUsePara = document.getElementById("one-time-use");
        oneTimeUsePara.innerText = "No orders has been there!";
        oneTimeUsePara.style.display = "block";
    }
};

for(const clearOrderBtn of clearOrderBtns)
    clearOrderBtn.addEventListener("click", clearOrder);
