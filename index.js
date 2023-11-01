const express = require('express');
const bodyParser  = require('body-parser') ;
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.routes');
require("dotenv").config()
const app = express();
app.use(bodyParser.json());

app.get("/", () => {
    res.send()
})
app.use(userRouter)
const port = process.env.port||3000
app.listen(port, async () => {
    try {
        await connection;
        console.log('Connection established');
    } catch (error) {
        console.log('Not connected to server');
    }
    console.log(`Server is listening on port ${port}`);
    
})
