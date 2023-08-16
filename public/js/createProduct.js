const createProduct = (product, csrfToken) => {
  const productItem = document.createElement("li");
  productItem.classList.add("product-item");

  const productArticle = document.createElement("article");

  const productImg = document.createElement("img");
  productImg.classList.add("product-image");
  productImg.src = product.imagePath;
  productImg.alt = product.title;

  productArticle.appendChild(productImg);

  const prodDataDiv = document.createElement("div");
  prodDataDiv.classList.add("product-data");

  const prodMetaDiv = document.createElement("div");
  prodMetaDiv.classList.add("product-meta");

  const title = document.createElement("h3");
  title.classList.add("title");
  title.textContent = product.title;
  prodMetaDiv.appendChild(title);

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = product.price;
  prodMetaDiv.appendChild(price);

  prodDataDiv.appendChild(prodMetaDiv);

  const prodActionDiv = document.createElement("div");
  prodActionDiv.classList.add("product-action");

  const prodViewLink = document.createElement("a");
  prodViewLink.textContent = "View";
  prodViewLink.classList.add("btn", "btn-light");
  prodViewLink.href = `/products/${product._id}`;
  prodActionDiv.appendChild(prodViewLink);

  const prodEditLink = document.createElement("a");
  prodEditLink.textContent = "Edit";
  prodEditLink.classList.add("btn", "btn-light");
  prodEditLink.style.marginLeft = "4px";
  prodEditLink.style.marginRight = "4px";
  prodEditLink.href = `/admin/products/${product._id}/edit`;
  prodActionDiv.appendChild(prodEditLink);

  const deleteForm = document.createElement("form");
  deleteForm.classList.add("delete-btn", "delete-product-btn");
  deleteForm.setAttribute("data-productid", product._id);
  deleteForm.setAttribute("data-csrftoken", csrfToken);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.type = "submit";
  deleteBtn.classList.add("btn", "btn-alt-light");
  deleteForm.appendChild(deleteBtn);

  deleteForm.addEventListener("submit", deleteProduct);
  prodActionDiv.appendChild(deleteForm);
  prodDataDiv.appendChild(prodActionDiv);

  productArticle.appendChild(prodDataDiv);
  productItem.appendChild(productArticle);

  return productItem;
};
