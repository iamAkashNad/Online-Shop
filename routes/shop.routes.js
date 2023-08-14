const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop.controller");
const shopSecurity = require("../middlewares/security/shop.middlerware");
const modifyCart = require("../middlewares/modifyCart.middleware");

router.get("/", shopController.redirectToMain);

router.get("/products", shopController.getProducts);

router.get("/products/:id", shopController.getProduct);

router.patch("/cart", modifyCart, shopController.addToCart);

router.get("/cart", modifyCart, shopController.getCart);

router.patch("/cart/:id", modifyCart, shopController.updateCart);

router.get("/checkout", shopSecurity, modifyCart, shopController.getCheckouts);

router.post("/checkout", shopSecurity, shopController.chargeForTheOrder);

router.get("/order/success", shopController.confirmPurchase);

router.get("/order/cancel", shopController.getCancelPurchasePage);

router.get("/orders", shopSecurity, shopController.getOrders);

router.get("/order/:orderId", shopSecurity, shopController.getInvoiceForOrder);

router.patch("/orders/cancel", shopSecurity, shopController.cancelOrder);

router.patch("/orders/clear", shopSecurity, shopController.clearOrder);

router.post("/orders/feedback", shopSecurity, shopController.submitFeedbackForDelivary);

module.exports = router;
