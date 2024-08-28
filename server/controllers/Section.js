const Course = require("../models/Course");
const Section = require("../models/Section");

// CRUD
exports.createSection = async(req,res) => {
    try{
        // data fetch from request
        const {sectionName, courseId} = req.body;

        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                succsess: false,
                message: "missing Component in sector",
            });
        }

        // create section
        const newSection = await Section.create({sectionName});

        // update course with section objectID
        const UpdatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
            $push:{couseContent:newSection._id,}
        }, {new:true})

        // return response 
        return res.status(200).json({
            succsess: true,
            message: "Section created successfully",
            UpdatedCourseDetails,
        })
    }

    catch(error){
        return res.status(500).json({
            succsess: false,
            message: "Unable to create section, please try again",
            error: error.message,
        })
    }
}

exports.updateSection = async(req,res) => {
    try{
        // data input
        const {sectionName, sectionId} = req.body;

        // data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                succsess: false,
                message: "missing Component in section",
            });
        }

        // update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {next: true});

        // return res
        return res.status(200).json({
            succsess: true,
            message: "Section updated successfully",
        });
    }

    catch(error){
        return res.status(500).json({
            succsess: false,
            message: "Unable to update section, please try again",
            error: error.message,
        })
    }
}

exports.deleteSection = async(req, res) => {
    try{
        // Get Id - assuming that we sending Ud we params
        const {sectionId} = req.params

        // find by id and delete
        await Section.findByIdAndUpdate(sectionId);
        // delete from course schema

        // return response
        return res.status(200).json({
            succsess: true,
            message: "Section deleted successfully",
        });
    }
    
    catch(error){
        return res.status(500).json({
            succsess: false,
            message: "Unable to delete section, please try again",
            error: error.message,
        })
    }
}