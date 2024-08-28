const Category = require("../models/Category");
const Tag = require("../models/Category");

exports.createCategory = async(req, res) => {
    try{
        const {name, description} = req.body;

        // validation
        if(!name || !description){
            return({
                success: false,
                message: "All fields are required",
            })
        }

        // create entry in DB
        const CategorysDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(CategorysDetails);

        // return Response
        return res.status(200).json({
            success: true,
            message: "Category Created Successfully ",
        });
    }

    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.showAllCategories = async(req, res) => {
    try{
        const allCategories = await Category.find({}, {name:true, description:true});

        // return Response
        return res.status(200).json({
            success: true,
            message: "All Categories returns Successfully ",
            allCategories,
        });
    }

    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};


// category Page details
exports.categoryPageDetails = async(req,res) => {
    try{
        // get category Id
        const {categoryId} = req.body;

        // get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
          })
          .exec()

        // validation (is course of this category available or not)
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "Selected Category is not available",
            });
        }

        // get different category courses
        const differentCategories = await Category.find({_id: {$ne: categoryId},}).populate("courses").exec();

        // get top selling courses
        const allCategories = await Category.find()
        .populate({
            path: "courses",
            match: {status: "Published"},
            populate:{
                path: "instructor",
            },
        })
        .exec()
        const allCourses = allCategories.flatMap((category) => category.courses);
        const topSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10);

        // return Response
        return res.status(200).json({
            success: true,
            data:{
                selectedCategory,
                differentCategories,
                topSellingCourses,
            }
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}