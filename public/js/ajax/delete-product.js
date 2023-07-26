const deleteProductButtons = document.querySelectorAll(".delete-product-btn");

const deleteProduct = async (event) => {
    event.preventDefault();
    const productId = event.target.dataset.productid;
    const csrfToken = event.target.dataset.csrftoken;
    let response;
    try {
        response = await fetch(`/admin/products/${productId}/delete?_csrf=${csrfToken}`, {
            method: "DELETE",
        });
    } catch(error) {
        slowNetwork();
        return;
    }

    if(!response.ok) {
        if(response.status === 404) notFound();
        else serverError();
        return;
    }

    event.target.parentElement.parentElement.parentElement.parentElement.remove();
};

for(const deleteProductButton of deleteProductButtons) {
    deleteProductButton.addEventListener("submit", deleteProduct);
}
