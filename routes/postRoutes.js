const express = require("express");
const { createPost, updatePost, deletePostData, getAllPostData, getSinglePostData } = require("../controller/postController");
const { isAuthenticate } = require("../middelwares/auth");
const router = express.Router();

router.post("/createpost", isAuthenticate, createPost)
router.put("/updatepost/:id", isAuthenticate, updatePost)
router.delete("/deletepost/:id", isAuthenticate, deletePostData)
router.get("/gellallpost", isAuthenticate, getAllPostData)
router.get("/getsinglepost/:id", isAuthenticate, getSinglePostData)

module.exports = router;