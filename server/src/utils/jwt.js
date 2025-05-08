const jwt = require("jsonwebtoken");

exports.generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "test-project", {
        expiresIn: process.env.JWT_EXPIRATION || "1h",
    });
};