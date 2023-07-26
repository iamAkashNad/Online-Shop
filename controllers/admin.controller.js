const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { sendEmail } = require("../util/Emails/sendEmails.util");

const removeImage = require("../util/removeImage.util");

const inputDataValidation = require("../validations/inputData.validation");
const productValidation = require("../validations/product/productData.validation");

const getCreateProduct = (req, res) => {
    const inputData = inputDataValidation.retreiveInputData(req, {
        hasError: false,
        title: "",
        summary: "",
        price: "",
        description: "",
    });
    res.render("admin/deshboard", { editMode: false, inputData: inputData });
};

const createProduct = async (req, res, next) => {
    const { title, summary, price, description } = req.body;

    if(!req.file) {
        inputDataValidation.storeInputData(req, {
            hasError: true,
            message: req.wrongFileUpload ? "File should be an image of the product!" : "Product Image is missing!",
            ...req.body
        }, () => {
            res.redirect("/admin/products/create");
        })
        return;
    }

    if(!productValidation(title, summary, price, description)) {
        return removeImage("product-images", req.file.filename)
        .then(() => {
            inputDataValidation.storeInputData(req, {
                hasError: true,
                message: "Invalid Inputs - please enter some valid ones!",
                ...req.body
            }, () => {
                res.redirect("/admin/products/create");
            });
        })
        .catch(error => next(error));
    }

    const productData = {};
    productData.title = title.trim();
    productData.summary = summary.trim();
    productData.price = price.trim();
    productData.description = description.trim();

    const product = new Product(productData, req.file.filename);
    try {
        await product.save();
    } catch(error) {
        return next(error);
    }
    res.redirect("/");
};

const getEditProduct = async (req, res, next) => {
    const productId = req.params.id;
    let product;
    try {
        product = await Product.fetchProductById(productId);
    } catch(error) {
        return next(error);
    }

    if(!product) {
        return res.status(404).render("common/404");
    }

    const inputData = inputDataValidation.retreiveInputData(req, {
        hasError: false,
        ...product,
    });
    res.render("admin/deshboard", { editMode: true, inputData: inputData });
};

const editProduct = async (req, res, next) => {
    const productId = req.params.id;
    const { title, summary, price, description } = req.body;
    if(!productValidation(title, summary, price, description) || req.wrongFileUpload) {
        try {
            if(req.file) await removeImage("product-images", req.file.filename);
        } catch(error) {}
        return inputDataValidation.storeInputData(req, {
            hasError: true,
            message: `Invalid Input - please enter some valid ones! 
                ${req.wrongFileUpload ? "(The file should be an image of the product...Nothing else)" : ""}
                `,
            ...req.body
        }, () => {
            res.redirect(`/admin/products/${productId}/edit`);
        });
    }

    const productData = {};
    productData.title = title.trim();
    productData.summary = summary.trim();
    productData.price = price.trim();
    productData.description = description.trim();

    const product = new Product(productData, req.file ? req.file.filename : null);
    let oldImage;
    try {
        const oldProduct = await Product.fetchProductById(productId);
        oldImage = oldProduct.image;
        await product.save(productId);
    } catch(error) {
        removeImage("product-images", req.file ? req.file.filename : null).then(() => {
            next(error);
        }).catch((error) => {
            next(error);
        });
        return;
    }

    if(req.file) {
        try {
            await removeImage("product-images", oldImage);
        } catch(error) {
            return next(error);
        }
    }
    res.redirect("/");
};

const deleteProduct = async (req, res, next) => {
    const productId = req.params.id;
    let deletedProductImage;
    try {
        const product = await Product.fetchProductById(productId);
        if(!product) return res.status(404).json({ message: "Invalid product id." });
        deletedProductImage = product.image;
        await Product.delete(productId);
        await removeImage("product-images", deletedProductImage);
    } catch(error) {
        return next(error);
    }

    res.status(203).json({ success: true });
};

const getManageOrders = async (req, res, next) => {
    let orders;
    try {
        orders = await Order.fetchAll({ admin_does_clear: undefined }, { user: 0 });
    } catch(error) {
        return next(error);
    }
    res.render("admin/manage-orders", { orders });
};

const getUserInfoForOrder = async (req, res) => {
    const orderId = req.query.orderId;
    let order;
    try {
        order = await Order.fetchById(orderId, { user: 1 });
    } catch(error) {
        return res.status(500).json({ success: false, message: "something went wrong internally", csrfToken: res.locals.csrfToken });
    }
    
    if(!order) return res.status(404).json({ success: false, message: "User not Found!", csrfToken: res.locals.csrfToken });

    res.json({ 
        success: true,
        message: "User Found for the Corresponding order!",
        user: order.user,
        csrfToken: res.locals.csrfToken 
    });
};

const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    if(!orderId || !status) return res.status(400).json({ success: false, message: "Bad data passed!" });

    const orderStatus = status[0].toUpperCase() + status.slice(1);
    if(orderStatus !== "Shipped" && orderStatus !== "Cancel") return res.status(400).json({ success: false, message: "Invalid order status!" });

    let order;
    try {
        order = await Order.fetchById(orderId);
        if(!order || order.status !== "Pending") return res.status(202).json({ success: false, message: "Status updation of the order isn't possible!" });

        const content = { status: orderStatus };
        if(orderStatus === "Cancel") content.cancel_initiator = "Admin";
        await Order.update(orderId, content);
        res.json({ success: true, status: orderStatus, message: "Order status updated successfully!" });
    } catch(error) {
        return res.status(500).json({ success: false, message: "Something went wrong Internally!" });
    }

    sendEmail(orderStatus === "Shipped" ? "order-shipped" : "order-cancel", { 
        email: order.user.email,
        order: order.items,
        totalPrice: order.totalPrice,
        INR: res.locals.INR
    })
    .catch(error => {});
};

const clearOrder = async (req, res) => {
    try {
      const orderId = req.body.orderId;
      const order = await Order.fetchById(orderId);
      if(!order) return res.status(404).json({ success: false, message: "Order for that ID not found!" });
  
      if(order.status !== "Cancel" && order.status !== "Delivered") return res.status(202).json({ success: false, message: "Order can't be cleared!" });
  
      if(order.admin_does_clear) return res.status(202).json({ success: false, message: "Order is already cleared!" });
  
      if(order.customer_does_clear) {
        order.admin_does_clear = true;
        await Order.shift(order);
      } else {
        await Order.update(orderId, { admin_does_clear: true });
      }

      const orders = await Order.fetchAll({ admin_does_clear: undefined }, { _id: 1 });
  
      res.json({ success: true, orderCount: orders.length, message: "Order cleared successfully!" });
    } catch(error) {
      res.status(500).json({});
    }
  };

module.exports = {
    getCreateProduct,
    createProduct,
    getEditProduct,
    editProduct,
    deleteProduct,
    getManageOrders,
    getUserInfoForOrder,
    updateOrderStatus,
    clearOrder
};
