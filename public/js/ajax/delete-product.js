const deleteProductButtons = document.querySelectorAll(".delete-product-btn");
const paginationSection = document.getElementById("page-controller");
const adminControlPara = document.getElementById("admin-use");
const productsList = document.getElementById("products-list");

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
    const responseData = await response.json();
    const { productCount, itemsPerPage, product, products } = responseData;

    if(product) {
        const productItem = createProduct(product, csrfToken);
        productsList.appendChild(productItem);
    } else if(products.length > 0) {
        for(const product of products) {
            productsList.appendChild(createProduct(product, csrfToken));
        }
    }

    if(productCount === 0) {
        adminControlPara.textContent = "No product has been added yet to the shop - Maybe you can add some!";
    }
    if(paginationSection && productCount <= itemsPerPage) paginationSection.remove();
};

for(const deleteProductButton of deleteProductButtons) {
    deleteProductButton.addEventListener("submit", deleteProduct);
}
