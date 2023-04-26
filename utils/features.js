const jwt = require("jsonwebtoken");
const scret_key = process.env.JWT_SCRET_KEY;


exports.sendCookiesData = (user, res, message, statusCode = 200) => {
    const token = jwt.sign({ _id: user._id }, scret_key);
    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
    }).json({
        status: true,
        message
    })
};

