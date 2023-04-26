const express = require("express");
const { registerUser, login, logoutUser, getUser } = require("../controller/userController");
const { isAuthenticate } = require("../middelwares/auth");
const router = express.Router();

router.post("/register", registerUser)
router.post("/login", login)
router.get("/logout", logoutUser)
router.get("/getuser", getUser)



module.exports = router;