const Course = require("../models/course");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_Secret;

const addCourse = async (req, res) => {
    const form = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(404).json({
            status: false,
            message: "Unauthorized demand on course creation !",
        });
    }

    const token = authHeader.split(" ")[1];
    const { id, username } = jwt.verify(token, JWT_SECRET);

    const addToForm = {
        instructerId: id,
        instructerName: username,
        isPublished: true,
    };

    const courseForm = { ...form, ...addToForm };

    try {
        const NewCourse = new Course(courseForm);

        await NewCourse.save();

        return res.status(201).json({
            success: true,
            message: "Course!s been added successfully...",
            data: NewCourse,
        });

        retur;
    } catch (error) {
        return res.status(404).json({
            status: false,
            message: "Unexpected error while adding course !",
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(404).json({
                status: false,
                message: "Unauthorized action while getCourses",
            });
        }

        const token = authHeader.split(" ")[1];
        const { id } = jwt.verify(token, JWT_SECRET);

        const courses = await Course.find({ instructerId: id });

        if (courses.length === 0) {
            return res.status(404).json({
                status: false,
                message: "You don't have any courses yet !",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Here are your courses ...",
            courses,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Unexpected error while getCourses",
        });
    }
};

const getCourse = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({
            success: false,
            message: "Problem with getting courseId !",
        });
    }

    try {
        const course = await Course.findOne({ _id: id });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Problem while getCourse !",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course got successfully...",
            course,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unexpected error while getCourse !",
        });
    }
};

module.exports = { addCourse, getCourses, getCourse };
