const Post = require("../models/postModel");
const joi = require("joi");
const multer = require("multer");
const path = require("path")
const fs = require("fs");
const postShcema = require("../validators/validators");
const mongoose = require("mongoose");


// Initial configration from multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/")
    },
    filename: (req, file, callback) => {
        // image file ka unique name create karna 
        let uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        callback(null, uniquename)
    }
});

// store image in database
const handleMulipartFormData = multer({
    storage,
    limits: {
        fileSize: 1000000 * 5    // or fileSize: 5 * 1024 * 1024 = 5mb
    }
}).single("image")


// ...................... create post data ...................... 
exports.createPost = async (req, res, next) => {
    handleMulipartFormData(req, res, async (err) => {
        if (err) return res.status(500).json({ status: false, message: "Internal server error" });

        // get file path jise db me store karna hai 
        const filePath = req.file.path;

        // validation
        const { error } = postShcema.validate(req.body);
        if (error) {
            // request validate hone se pahle image ko delete karna
            // rootfolder/uploads/file.png
            fs.unlink(`${appRoot}/${filePath}`, (err) => {
                // if error hai tabhi call karna hai 
                if (err) return res.status(422).json({ message: err.message })
            })
            // joi error
            return res.status(422).json({ message: error.message })
        };

        const { title, author, category, content } = req.body;

        const post = new Post({
            title, author, category, content,
            user: req.user._id,
            image: filePath
        });

        try {
            await post.save();
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Internal server error!"
            });
        }
        res.status(201).json({
            status: true,
            message: "Post create successfully",
            post: post
        })
    })

};

// ...................... update post data ...................... 
exports.updatePost = async (req, res) => {
    handleMulipartFormData(req, res, async (err) => {
        if (err) return res.status(500).json({ status: false, message: "Internal server error" });

        // if you have a req.file data then get data otherwise optional
        let filePath;
        if (req.file) {
            filePath = req.file.path
        }
        // validation
        const { error } = postShcema.validate(req.body);
        if (error) {
            if (req.file) {
                // request validate hone se pahle image ko delete karna
                // rootfolder/uploads/file.png
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    // if error hai tabhi call karna hai 
                    if (err) return res.status(422).json({ message: err.message })
                });
            }
            return res.status(422).json({ message: error.message })
        };

        const { title, author, category, content } = req.body;
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) return res.status(422).json({ message: "This is not valid id." })

        let updatePostData;
        try {
            updatePostData = await Post.findOneAndUpdate({ _id: id }, {
                title,
                author,
                category,
                content,
                ...(req.file && { image: filePath }),  // if req.file hai to update karo nahi to optional rahna chahiye 
            }, { new: true });
           
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: "Internal server error!"
            });
        };
        res.status(200).json({ status: true, message: "Post is succefully update.", post: updatePostData })
    })
};


// ...................... delete post data ...................... 
exports.deletePostData = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(422).json({ message: "This is not valid id." });

    let document = await Post.findByIdAndDelete({ _id: id }, { new: true })
    if (!document) return res.status(204).json({ message: "This post already deleted!" });

    // image delete our uploads folder
    const imagePath = document._doc.image;

    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
        if (err) return res.status(500).json({ message: err.message })
        res.status(200).json({ status: true, message: "Post is succefully delete." })
    });

}

// ...................... get all post data ...................... 
exports.getAllPostData = async (req, res, next) => {

    // find post data from query method  
    const { author, title, category } = req.query;
    let queryObject = {};

    if (author) {
        queryObject.author = { $regex: author, $options: "i" }
    }
    if (title) {
        queryObject.title = title.trim()
    }
    if (category) {
        queryObject.category = { $regex: category, $options: "i" }
    }

    //fetch data from database
    let apiData = Post.find(queryObject);

    // pagination method
    let page = Number(req.query.page) || 1;
    let limits = Number(req.query.limit) || 3;
    let skips = (page - 1) * limits // (1-1) * 4 = 0
    apiData = apiData.skip(skips).limit(limits);

    let postData;
    try {
        postData = await apiData.select("-__v -updatedAt")
    } catch (error) {
        res.status(200).json({
            status: false, message: "Internal server error!"
        })
    }

    let totalData;
    try {
        totalData = await Post.find();
    } catch (error) {
        res.status(500).json({
            status: false, message: "Internal server error!"
        })
    }

    res.status(200).json({
        status: true,
        message: "Get all posts succefully update.",
        page: page,
        pageSize: postData.length,
        totalPost: totalData.length,
        posts: postData,
    })
    
};

// ...................... get single post data ...................... 

exports.getSinglePostData = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(422).json({ message: "This is not valid id." });
    
    let post;
    try {
        post = await Post.findById({ _id: id }).select("-__v -updatedAt");
    } catch (error) {
        res.status(200).json({
            status: true, message: "Internal server error!"
        })
    }

    if (!post) return res.status(404).json({ message: "This post is not available" })

    res.status(200).json({ status: true, message: "Get single posts succefully update.", posts: post })
};


