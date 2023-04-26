const mongoose = require("mongoose");
require("dotenv").config()

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Database is connected successfully! ")
        }).catch(error => {
            console.log("object")
            console.log(error.message)
            process.exit(1)
        })
}
module.exports = dbConnect;