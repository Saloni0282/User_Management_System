const mongoose = require('mongoose');
require("dotenv").config();
const connection = mongoose.connect(process.env.mongoUrl).then(() => {
    console.log("connected to db")
}).catch((err) => {
    console.log(err)
});
module.exports = {
    connection
}