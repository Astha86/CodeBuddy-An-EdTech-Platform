const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");

// create rating
exports.createRating = async(req,res) => {
    // creating Rating
    try{
        // get user id
        const userId = req.user.Id;

        // fetched data from req body
        const {rating, review, courseId} = req.body;

        // check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id:courseId,
            studentEnrolled: {$elements: {$req: userId}},
        });

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course",
            });
        }

        // check if user already reviewed the course
        const alreadyreviewed = await RatingAndReviews.findOne({
            user:userId,
            course:courseId,
        });

        // create rating and review
        const ratingReview = await RatingAndReviews.create({
            rating, review,
            course:courseId,
            user:userId,
        })

        // update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReviews: ratingReview._id,
            }
        }, {new:true});
        console.log(updatedCourseDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and review created successfully",
            ratingReview,
        })
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// Get average rating
exports.getAverageRating = async(req,res) => {
    try{
        // get course id
        const courseId = req.body.courseId;

        // calculate average rating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    // also converting string to object id
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    // all entries wrap in single group
                    _id: null,
                    averageRating: {$avg: "$rating"},
                }
            }
        ])

        // return rating
        if(result.rating>0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // if no ratings exist
        return res.status(200).json({
            success: true,
            message: "No ratings till now",
            averageRating: 0,
        });
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// Get all rating 
exports.getAllRating = async (req,res) => {
    try{
        const allReviews = RatingAndReviews.find({})
        .sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastname email image",
        })
        .populate({
            path:"course",
            select: "courseName",
        })
        exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}