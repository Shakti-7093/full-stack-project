const bcrypt = require("bcryptjs");
const { User } = require("../../models").models;
const { successResponse, errorResponse } = require("../utils/response");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role_id } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return errorResponse(res, "Email already exists", 400);

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role_id,
        });

        return successResponse(res, { user }, "User registered successfully", 201);
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