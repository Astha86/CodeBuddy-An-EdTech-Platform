const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// Send otp
exports.sendotp = async(req, res) => {

    try{
        // fetching email from request body
        const {email} = req.body;

        // check if user already exists
        const checkUserPresent = await User.findOne({email});

        // if user already exist then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }

        // else generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Printing OTP
        console.log("OTP Generated : ",otp);

        // check unique OTP or not
        let result = await OTP.findOne({otp: otp});

        // if otp is present in DB that means it is not unique, so regenerate
        while(result){
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                // lowerCaseAlphabets: false,
                // specialChars: false,
            });
            //result = await OTP.findOne({otp: otp});
        }
        // Unique otp generated now save it in DB

        const otpPayload = {email, otp};

        // create an entry for OTP
        const otpBody = await OTP.create(otpPayload); 
        //this line (.create) also hit the pre save hook which send mail to user

        console.log(otpBody);

        res.status(200).json({
            success: true,
            message:'OTP Sent Successfully',
            otp,
        })

    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};


// sign up
exports.signup = async(req, res) => {

    try{
        // Fetching data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        // Validate the data
        if(!firstName || !lastName  || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message: "All fields are mandatory",
            });
        }

        // Check both password are same
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message: "Password and confirm password are not same, Please Re-enter!!",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message: "User already Registered",
            });
        }

        // Find most recent OTP in DB
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        // Validation of OTP
        if(recentOtp.length === 0){
            // That means OTP not found
            return res.status(400).json({
                success:false,
                message: "OTP not found",
            })
        }

        // Verify User OTP and DB OTP are same
        else if(otp !== recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message: "Wrong OTP",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)

        // Create entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Return response
        return res.status(200).json({
            success: true,
            message: 'User is registered Successfully',
            user,
        });
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "SignIn Failure !!",
        })
    }
};


// Login
exports.login = async(req, res) => {

    try{
        // Fetching data from request body
        const {email, password} = req.body;

        // Validate the data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message: "All fields are mandatory",
            });
        }

        // Check if user already exists
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message: "User not Registered",
            });
        }

        // generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
				{ email: user.email, id: user._id, accountType: user.accountType },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

            // Save token to user document in database
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message: "LoggedIn Successfully",
            })
        }

        else{
            return res.status(401).json({
                success:false,
                message: "Password is Incorrect",
            });
        }
        
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"LogIn Failure !!",
        })
    }
};


// change password 
exports.changePassword = async (req,res) => {
    try{
		// Get userId
		const userDetails = await User.findById(req.user.id);

		// Fetching data from request body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );

		if (!isPasswordMatch) {
			return res.status(401).json({
                success: false, 
                message: "Old password is incorrect" 
            });
		}

		// matching new password and confirm new password
		if (newPassword !== confirmNewPassword){
			return res.status(400).json({
				success: false,
				message: "The new password and confirm new password does not match",
			});
		}

		// Update password in DB
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
			{password: encryptedPassword},
			{new: true}
		);


		// Send email of successfully password changed
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} 
        
        catch (error) {
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res.status(200).json({ 
            success: true, 
            message: "Password updated successfully" 
        });
	}


    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Error occurred while updating password",
			error: error.message,
        });
    }
}