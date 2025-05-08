const { body } = require("express-validator");

exports.registerValidation = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role_id").notEmpty().withMessage("Role is required"),
];

exports.loginValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role_id").notEmpty().withMessage("Role is required"),
];

exports.verifyOtpValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp").notEmpty().withMessage("OTP is required"),
];

exports.resendOtpValidation = [
    body("email").isEmail().withMessage("Valid email is required"),
];