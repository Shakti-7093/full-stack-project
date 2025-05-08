const express = require("express");
const router = express.Router();
const { register, login, verifyOtp, resendOtp } = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const { registerValidation, loginValidation, verifyOtpValidation, resendOtpValidation } = require("../validations/auth.validation");

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/verify-otp", verifyOtpValidation, validate, verifyOtp);
router.post("/resend-otp", resendOtpValidation, validate, resendOtp);


module.exports = router;