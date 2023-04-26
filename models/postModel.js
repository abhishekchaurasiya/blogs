const mongoose = require("mongoose")
const Schema = mongoose.Schema;
require("dotenv").config()

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        // use here getters 
        get: (image) => {
            // http://localhost:8080/uploads\1682478548781-439188705.jpeg
            return `${process.env.IMAGE_APP_URL}/${image}`
        }
    },
    deletedAt: {
        type: Date,
        default: new Date().now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date().now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true, toJSON: { getters: true }, id: false })

module.exports = mongoose.model("Post", postSchema)