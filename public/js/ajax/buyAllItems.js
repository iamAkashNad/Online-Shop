const buyAllButton = document.getElementById("buy-all-btn");

const buyAllItems = async () => {
    let response;
    try {
        response = await fetch("/cart/buy/all", {
            method: "POST",
            body: JSON.stringify({
                _csrf: buyAllButton.dataset.csrftoken,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
    } catch(error) {
        slowNetwork();
        return;
    }

    if(!response.ok) {
        serverError();
        return;
    }

    const responseData = await response.json();
    if(responseData.orderPlaced) {
        const cartList = document.getElementById("cart-items");
        const cartMeta = document.getElementById("cart-meta");
        const workspaceDiv = document.getElementById("workspace");
        cartList.innerHTML = "";
        cartMeta.innerHTML = "";
        workspaceDiv.innerHTML = "<p>No items in the cart!</p>";
        const cartQtyBedges = document.querySelectorAll(".cart-qty");
        for(const cartQtyBedge of cartQtyBedges)
            cartQtyBedge.textContent = "0";
        showMessage("Order Placed Successfully!", "Your order is placed and now you have to pay for this order in the orders page for sending the order notification to the admin. Importent Note: If any product(s) is/are out of stock then that will be remove from the order in the process.")
        return;
    }
    showMessage("Out Of Stock!", "All the items in your cart are not available in our shop. So, we can't make your order. Sorry for the inconvenience");
};

buyAllButton.addEventListener("click", buyAllItems);
