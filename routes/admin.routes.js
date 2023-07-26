const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin.controller");

const adminSecurity = require("../middlewares/security/admin.middleware");

const multerConfig = require("../config/multer.config");

const multerOpload = multerConfig("public/product-images");

router.get("/products/create", adminSecurity, adminController.getCreateProduct);

router.post("/products/create", adminSecurity, multerOpload.single("product-image"), adminController.createProduct);

router.get("/products/:id/edit", adminSecurity, adminController.getEditProduct);

router.post("/products/:id/edit", adminSecurity, multerOpload.single("product-image"), adminController.editProduct);

router.delete("/products/:id/delete", adminSecurity, adminController.deleteProduct);

router.get("/orders/manage", adminSecurity, adminController.getManageOrders);

router.get("/orders/user", adminSecurity, adminController.getUserInfoForOrder);

router.patch("/order/status/update", adminSecurity, adminController.updateOrderStatus);

router.patch("/orders/clear", adminSecurity, adminController.clearOrder);

module.exports = router;
