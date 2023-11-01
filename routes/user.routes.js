const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { UserModel } = require("../model/user.model")
const { authorization } = require("../middlewares/authorization")

const userRouter = express.Router();

userRouter.post("/api/users/register",
    [body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters")
        .matches(/[A-Z]/).withMessage("Password must contain one Uppercase letter")
    .matches(/[@#*$^%!&()_]/).withMessage("Password must contain at least one unique character")],
    async (req, res) => {
        
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return res.status(400).json({status:400,error:error.array()})
            }
            const { first_name, last_name, email, mobile, password, role, status } = req.body;
            const user = await UserModel.findOne({ email })
            if (user) {
                res.status(501).json({ status: 501, message:"Email already Exists"})
            }
            const hashedPassword = await bcrypt.hash(password, 8)
            const newUser = new UserModel({
                first_name, last_name, email, mobile, password:hashedPassword, role, status 
            })
            await newUser.save();
            res.json({
                status: 200,
                message: "Account successfully created"
            })
        } catch (error) {
            res.json({
                status:400,
                message: "An error occurred while creating the account"
            })
        }

    })


userRouter.post("/api/users/login", async (req, res) => {
    try {
        const { email, password,role } = req.body;
        const user = await UserModel.findOne({ email,role });
        if (!user) {
            res.json({status:501, message:"User not found"})
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) { 
            res.json({status:500, message:"Invalid password"})
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY,
            {
                expiresIn: "30d"
            })
        res.json({
            status: 200,
            message: 'Logged in successfully',
            data: {
                userDetails: {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role,
                    status: user.status,
                },
                token,
            }
})
    } catch (error) {
        res.json({status:500,message:"An error occurred while logging in"})
    }
})

userRouter.get("/api/users/details", authorization, async(req, res) => { 
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            res.json({status: 404, message:"User not found"})
        }
        res.json({
            status: 200,
            data: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        res.json({ status: 500, message: "An error occurred while getting user details" })
    }
})

userRouter.get("/api/users", async (req, res) => {
    try {
        const filter = req.query;
        const user = await UserModel.find(filter);
        res.json({status: 200, data: user})
    } catch (error) {
        res.json({ status: 500, message: "An error occurred while filtering user" })
    }
})


module.exports = {
    userRouter
}
