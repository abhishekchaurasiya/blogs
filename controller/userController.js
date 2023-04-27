const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const joi = require("joi");
const { sendCookiesData } = require("../utils/features");
const { ErrorHandler } = require('../middelwares/errorHandler');


// User Register Controller
exports.registerUser = async (req, res, next) => {

    // validation with joi library
    const userSchema = joi.object({
        first_name: joi.string().min(3).required(),
        last_name: joi.string().min(3).required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(6).max(30)
    });

    // check error of req.body
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(422).json({ message: error.message })
    }

    // destructured
    const { first_name, last_name, email, password } = req.body;

    // check existing email in our db
    try {
        const existUser = await User.findOne({ email });
        if (existUser) return next(new ErrorHandler("This is user is already exists!", 403))

    } catch (error) {
        return next(error)
    };

    // bcrypt data
    const salt = await bcrypt.genSalt(10);
    const haspassword = await bcrypt.hash(password, salt);

    // Create user object
    const user = new User({
        first_name,
        last_name,
        email,
        password: haspassword
    });

    // save user data in db
    try {
        await user.save();
    } catch (error) {
        return next(error)
    }

    // send response
    sendCookiesData(user, res, "User register successfully!", 201);
};

// Login Controller
exports.login = async (req, res, next) => {

    // validation with joi library
    const userSchema = joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(6).max(30)
    });

    // check error of req.body
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(422).json({ message: error.message })
    };

    const { email, password } = req.body;
    try {
        // check user and password is valid or not valid
        const user = await User.findOne({ email }).select("+password");
        if (!user) return next(new ErrorHandler("Invalid Email and Password", 403))

        // compare password db and req.body
        const isMatchedPassword = await bcrypt.compare(password, user.password);
        if (!isMatchedPassword) return next(new ErrorHandler("Invalid Email and Password", 403));

        const { first_name } = user;
        const name = first_name.charAt(0).toUpperCase() + first_name.slice(1)

        // send response
        sendCookiesData(user, res, `You are logged in ${name}`, 200)

    } catch (error) {
        return next(error)
    }
};

exports.logoutUser = async (req, res, next) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
        }).json({
            status: true,
            message: "User Successfully logout!",
            user: req.user
        })
    } catch (error) {
        return next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        res.status(200).json({
            status: true,
            message: "Get Successfully User Data",
            user: req.user
        })
    } catch (error) {
        next(error)
    }
}

