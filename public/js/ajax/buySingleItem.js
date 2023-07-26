const buyItemBtns = document.querySelectorAll(".item-buy-btn");
const totalQtyBedges = document.querySelectorAll(".cart-qty");
const cartTotalPriceElement = document.getElementById("cart-total");

const buySingleItem = async (event) => {
  // console.log("buy button clicked!");
  const clickedButton = event.target.parentElement.parentElement;
  const csrfToken = clickedButton.dataset.csrftoken;
  const productId = clickedButton.dataset.productid;

  let response;
  try {
    response = await fetch(`/cart/buy/single`, {
      method: "POST",
      body: JSON.stringify({
        _csrf: csrfToken,
        productId: productId,
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
  if (responseData.outOfStock) {
    showMessage(
      "Out Of Stock!",
      "The product which you want to order is currently not available in our stock. So, we can't procide this order."
    );
    return;
  }

  clickedButton.parentElement.parentElement.parentElement.remove();
  for (const totalQtyBedge of totalQtyBedges)
    totalQtyBedge.textContent = responseData.totalQuentity;
  if (responseData.totalQuentity === 0) {
    workspaceDiv.innerHTML = `<p>No items in the cart!</p>`;
    cartMetaElement.style.display = "none";
    return;
  }
  cartTotalPriceElement.textContent = "$" + responseData.totalPrice;
};

for (const buyItemBtn of buyItemBtns)
  buyItemBtn.addEventListener("click", buySingleItem);
