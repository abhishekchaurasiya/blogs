const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        min: 3
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)