const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req,res) => {
    try{
        // get data
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;

        // get userId
        const id = req?.user.id;

        // Validation 
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails?.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;
        profileDetails.gender = gender;

        // changes save in DB
        await profileDetails?.save();

        // return response
        return res.status(400).json({
            success:true,
            message:"Profile Updated Successfully",
            profileDetails,
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in profile updation",
            error: error.message,
        });
    }
};

// Delete Account
exports.deleteAccount = async(req,res) => {
    try{
        // getId
        const id = req.user.id;

        // get User
        const userDetails = await User.findById(id);

        // validation
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Not Found",
                error: error.message,
            });
        }

        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        // unenroll user from all enrolled courses ---------------------------------(Pending)

        // delete user
        await User.findByIdAndDelete({_id:id});
        
        // return response
        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully",
        });

    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in profile deletion",
            error: error.message,
        });
    }
};

exports.getAllUserDetails = async(req,res) => {
    try{
        // getId
        const id = req.user.id;

        // get User
        const userDetails = await User.findById(id).populate(additionalDetails).exec();

        // validation
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Not Found",
                error: error.message,
            });
        }
        
        // return response
        return res.status(200).json({
            success:true,
            message:"User fetched Successfully",
        });
        
    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in fetching user data",
            error: error.message,
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;

        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        console.log(image);
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        );

        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        });
    } 
    
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

exports.getEnrolledCourses = async (req, res) => {
	try {
        const userId = req.user.id
        let userDetails = await User.findOne({_id: userId,})
            .populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                path: "subSection",
                },
            },
            })
            .exec()

        userDetails = userDetails.toObject();
        console.log(userDetails);
        var SubsectionLength = 0;

        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubsectionLength +=  userDetails.courses[i].courseContent[j].subSection.length
            }

            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            });
            courseProgressCount = courseProgressCount?.completedVideos.length;

            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } 
            
            else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                Math.round(
                    (courseProgressCount / SubsectionLength) * 100 * multiplier
                ) / multiplier
            }
        }
    
        if (!userDetails) {
            return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });
	} 
    
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
	}
}

exports.instructorDashboard = async(req, res) => {
	try{
		const courseDetails = await Course.find({instructor:req.user.id});

		const courseData  = courseDetails.map((course)=> {
			const totalStudentsEnrolled = course.studentsEnrolled.length
			const totalAmountGenerated = totalStudentsEnrolled * course.price

			//create an new object with the additional fields
			const courseDataWithStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudentsEnrolled,
				totalAmountGenerated,
			}
			return courseDataWithStats
		})

		res.status(200).json({courses:courseData});

	}
	catch(error) {
		console.error(error);
		res.status(500).json({message:"Internal Server Error"});
	}
}