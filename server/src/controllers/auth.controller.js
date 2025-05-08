const bcrypt = require("bcryptjs");
const { User, Role } = require("../../models");
const { successResponse, errorResponse } = require("../utils/response");
const { generateToken } = require("../utils/jwt");
const validateEmailDomain = require('../utils/emailValidator');
const { sendOtpEmail } = require('../utils/mailer');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        const isValidEmail = await validateEmailDomain(email);
        if (!isValidEmail) return errorResponse(res, 'Invalid email domain.', 400);

        const roleRecord = await Role.findOne({ where: { name: role } });
        if (!roleRecord) return errorResponse(res, 'Invalid role specified.', 400);

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return errorResponse(res, "Email already exists", 400);

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role_id: roleRecord.id,
            otp,
            otpExpiresAt
        });

        await sendOtpEmail(email, otp);

        return successResponse(res, { user }, "User registered. Verification code sent to email.", 201);
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return errorResponse(res, "Invalid email or password", 401);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return errorResponse(res, "Invalid email or password", 401);

        const token = generateToken(user.id);
        return successResponse(res, { token, user }, "Login successful");
    } catch (err) {
        return errorResponse(res, err.message);
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return errorResponse(res, "User not found", 404);

    if (user.otp !== otp) return errorResponse(res, "Invalid OTP", 400);

    if (new Date() > user.otpExpiresAt) return errorResponse(res, "OTP has expired", 400);

    user.otp = null;
    user.otpExpiresAt = null;
    user.isVerified = 1;
    await user.save();

    return successResponse(res, null, "OTP verified successfully");
};

exports.resendOtp = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return errorResponse(res, "User not found", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOtpEmail(email, otp);

    return successResponse(res, null, "OTP resent successfully");
}