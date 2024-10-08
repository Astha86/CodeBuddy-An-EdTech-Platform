const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async(req, res, next) => {
    try{
        // extract token 
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");

        // if token missing, then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing !!",
            });
        }

        // verify the token 
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }

        catch(err){
            // issue in verification
            return res.status(401).json({
                success:false,
                message:"Invalid Token !!",
            })
        }

        next();
    }

    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        })
    }
}


// isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Students only",
            });
        }
        next();
    }

    catch(err){
        return res.status(500).json({
            success:false,
            message:"User Role Can't be verified !!",
        })
    }
}


// isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Instructor only",
            });
        }
        next();
    }

    catch(err){
        return res.status(500).json({
            success:false,
            message:"User Role Can't be verified !!",
        })
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for Admin only",
            });
        }
        next();
    }

    catch(err){
        return res.status(500).json({
            success:false,
            message:"User Role Can't be verified !!",
        })
    }
}