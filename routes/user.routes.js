const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");
const profileSecurity = require("../middlewares/security/profile.middleware");

const multerConfig = require("../config/multer.config");

const multerOpload = multerConfig("public/userimages");

router.get("/profile", profileSecurity, userController.getUser);

router.get("/edit", profileSecurity, userController.getEditUser);

router.post("/edit", profileSecurity, multerOpload.single("user-image"), userController.editUser);

module.exports = router;
