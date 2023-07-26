const addToCartButton = document.getElementById("add-to-cart-btn");
const cartQtyBedges = document.querySelectorAll(".cart-qty");

const addToCart = async () => {
    const productId = addToCartButton.dataset.productid;
    const csrfToken = addToCartButton.dataset.csrftoken;
    // console.log(csrfToken);
    let response;
    try {
        response = await fetch("/cart", {
            method: "PATCH",
            body: JSON.stringify({ 
                productId: productId,
                _csrf: csrfToken
             }),
            headers: {
                'Content-Type': 'application/json',
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
    for(const cartQtyBedge of cartQtyBedges)
        cartQtyBedge.textContent = responseData.totalQuentity;
    
    if(responseData.itemLimitExceed) {
        showMessage("Your cart's limit exceeded!", "You can add at most 20 items in your cart. And you already done that so, you can't add more than that number of items in your cart.");
    }
};

addToCartButton.addEventListener("click", addToCart);
