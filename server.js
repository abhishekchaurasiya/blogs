const express = require("express")
require("dotenv").config();
const dbConnect = require("./config/database")
const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")
const cookieParser = require("cookie-parser");
const { errorMiddleWare } = require("./middelwares/errorHandler");
const port = process.env.PORT;
const path = require("path");

const app = express();
dbConnect()

// Here gets current folder path and create a global variable
global.appRoot = path.resolve(__dirname)

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", postRouter);

// this api use for uploads folder ke image ko show karti hai 
app.use("/uploads",express.static("uploads"))

// Error handler 
app.use(errorMiddleWare)

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running at port ${port}`)
        })
    } catch (error) {
        console.log(error.message)
    }
};
start();

app.get("/", (req, res) => {
    res.send(`<h1>Blog app running</h1>`)
});