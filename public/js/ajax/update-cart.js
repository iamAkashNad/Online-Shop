const updateCartBtns = document.querySelectorAll(".update-cart-btn");
const cartQuentityBedges = document.querySelectorAll(".cart-qty");
const cartTotalPrice = document.getElementById("cart-total");
const workspaceDiv = document.getElementById("workspace");
const cartMetaElement = document.getElementById("cart-meta");

const updateCart = async (event) => {
  const clickedUpdateCartBtn = event.target;
  const csrfToken = clickedUpdateCartBtn.dataset.csrftoken;
  const productId = clickedUpdateCartBtn.dataset.productid;
  const quentity = +clickedUpdateCartBtn.parentElement.previousElementSibling.firstElementChild.value;
  let response;
  try {
    response = await fetch(`/cart/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({
        _csrf: csrfToken,
        newQty: quentity,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    slowNetwork();
    return;
  }
  if (!response.ok) {
    serverError();
    return;
  }

  const responseData = await response.json();
  if(responseData.negativeQuentity) {
    showMessage("Negative Quentity!", "You entered negative input as the updated quentity for your cart item which isn't accepted!");
    return;
  }
  if(responseData.notANumber) {
    showMessage("Invalid Quentity!", "Please enter a valid quentity for the cart item in order to update the cart item inside your cart.");
    return;
  }
  if (quentity === 0) {
    clickedUpdateCartBtn.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
    if(responseData.numberOfItems === 0) {
      workspaceDiv.innerHTML = "<p>No items in the cart!</p>";
      cartMetaElement.style.display = "none";
    }
  } else {
    clickedUpdateCartBtn.parentElement.previousElementSibling.value = responseData.totalQty;
    if(!responseData.outOfStock) {
      clickedUpdateCartBtn.parentElement.parentElement.parentElement.previousElementSibling.lastElementChild.firstElementChild.textContent =
        INR.format(responseData.totPrice);
    }
  }
  for (const cartQuentityBedge of cartQuentityBedges) {
    cartQuentityBedge.textContent = responseData.totalQuentity;
  }
  cartTotalPrice.textContent = INR.format(responseData.totalPrice);
  if(responseData.itemLimitExceed) {
    showMessage("Your cart's limit exceeded!", "You can add at most 20 items in your cart. And you already done that so, you can't add more than that number of items in your cart.");
  }
};

for (const updateCartBtn of updateCartBtns)
  updateCartBtn.addEventListener("click", updateCart);
