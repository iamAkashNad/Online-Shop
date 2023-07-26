const express = require("express");

const multerConfig = require("../config/multer.config");
const authController = require("../controllers/auth.controller");

const { lockSignupVarification } = require("../middlewares/security/signup.middleware");
const clearVerificationData = require("../middlewares/clearVerificationData.middleware");
const { lockForgotVarification, backToUserProfile } = require("../middlewares/security/login.middleware");

const router = express.Router();

const multerOpload = multerConfig("public/userimages");

router.get("/signup", clearVerificationData, backToUserProfile, authController.getSignup);

router.post("/signup", multerOpload.single("user-image"), authController.signup);

router.get("/signup/verify", lockSignupVarification, authController.getVerifyPage);

router.patch("/verify-code/send", authController.getVerifyCode);

router.post("/signup/verify", lockSignupVarification, authController.verifySignup);

router.get("/signup/cancel", lockSignupVarification, authController.cancelSignup);

router.get("/login", clearVerificationData, backToUserProfile, authController.getLogin);

router.get("/login/forgot", backToUserProfile, authController.getSendCodePageForForgot);

router.post("/login/code/send", authController.sendVerifyCodeForForgot);

router.get("/login/password/set", lockForgotVarification, authController.getSetNewPasswordPage);

router.post("/login/password/set", lockForgotVarification, authController.resetPasswordAfterVerification);

router.get("/login/forgot/fail", lockForgotVarification, authController.getFailedForgotPage);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

module.exports = router;
