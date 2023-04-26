const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const scret_key = process.env.JWT_SCRET_KEY;

exports.isAuthenticate = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).json({
            status: false,
            message: "Login first"
        });

        const decodedToken = jwt.verify(token, scret_key);
        const user = await User.findById(decodedToken._id);

        req.user = user;
        next()

    } catch (error) {
        return next(error)
    }
}