// src/controllers/course.controller.js
const Course = require('../models/Course');
const Tutorial = require('../models/Tutorial');

// COURSES
// Obtener todos los cursos publicados
exports.getAllCourses = async (req, res) => {
    try {
        const { category, level, limit = 10, page = 1 } = req.query;
        const skip = (page - 1) * limit;

        let query = { status: 'published' };
        if (category) query.category = category;
        if (level) query.level = level;

        const [courses, total] = await Promise.all([
            Course.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Course.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        if (total === 0) {
            return res.status(200).json({
                ok: true,
                data: [],
                message: "No courses were found that met those criteria.",
                pagination: { page, limit, totalItems: 0, totalPages: 0, hasNextPage, hasPrevPage }
            });
        }

        res.status(200).json({
            ok: true,
            data: courses,
            message: "All available courses",
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: total,
                totalPages: totalPages,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (error) {
        console.error('--- GET ALL COURSES ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            data: null,
            message: 'Error retrieving courses'
        });
    }
};

// Obtener un curso por slug
exports.getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const course = await Course.findOne({ slug, status: 'published' });

        if (!course) {
            return res.status(404).json({
                ok: false,
                data: null,
                type: 'NotFoundError',
                message: "Course not found"
            });
        }

        res.status(200).json({
            ok: true,
            data: course,
            message: "Course details retrieved successfully"
        });
    } catch (error) {
        console.error('--- GET COURSE BY SLUG ERROR ---', error);
        res.status(500).json({
            ok: false,
            data: null,
            type: 'ServerError',
            message: "Error retrieving course details"
        });
    }
};

// TUTORIALS
// Obtener todos los tutoriales publicados
exports.getAllTutorials = async (req, res) => {
    try {
        const { category, limit = 10, page = 1, featured } = req.query;
        const skip = (page - 1) * limit;

        let query = { status: 'published' };
        if (category) query.category = category;
        if (featured === 'true') query.isFeatured = true;

        const [tutorials, total] = await Promise.all([
            Tutorial.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Tutorial.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        if (total === 0) {
            return res.status(200).json({
                ok: true,
                data: [],
                message: "No tutorials were found that met those criteria.",
                pagination: { page, limit, totalItems: 0, totalPages: 0, hasNextPage, hasPrevPage }
            });
        }

        res.status(200).json({
            ok: true,
            data: tutorials,
            message: "All available tutorials",
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: total,
                totalPages: totalPages,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (error) {
        console.error('--- GET ALL TUTORIALS ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            data: null,
            message: 'Error retrieving tutorials'
        });
    }
};

// Obtener un tutorial por slug
exports.getTutorialBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const tutorial = await Tutorial.findOne({ slug, status: 'published' });

        if (!tutorial) {
            return res.status(404).json({
                ok: false,
                data: null,
                type: 'NotFoundError',
                message: "Tutorial not found"
            });
        }

        res.status(200).json({
            ok: true,
            data: tutorial,
            message: "Tutorial details retrieved successfully"
        });
    } catch (error) {
        console.error('--- GET TUTORIAL BY SLUG ERROR ---', error);
        res.status(500).json({
            ok: false,
            data: null,
            type: 'ServerError',
            message: "Error retrieving tutorial details"
        });
    }
};

// Obtener tutoriales destacados (sin paginación, solo featured)
exports.getFeaturedTutorials = async (req, res) => {
    try {
        const tutorials = await Tutorial.find({ status: 'published', isFeatured: true })
            .sort({ createdAt: -1 })
            .limit(6);

        if (tutorials.length === 0) {
            return res.status(200).json({
                ok: true,
                data: [],
                message: "No featured tutorials found"
            });
        }

        res.status(200).json({
            ok: true,
            data: tutorials,
            message: "Featured tutorials retrieved successfully"
        });
    } catch (error) {
        console.error('--- GET FEATURED TUTORIALS ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            data: null,
            message: "Error retrieving featured tutorials"
        });
    }
};



// CREATE COURSE (con videos desde el inicio)
exports.createCourse = async (req, res) => {
    try {
        const courseData = req.body;
        
        const newCourse = await Course.create(courseData);

        res.status(201).json({
            ok: true,
            data: newCourse,
            message: 'Course created successfully'
        });
    } catch (error) {
        console.error('--- CREATE COURSE ERROR ---', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                type: 'DuplicateError',
                message: 'A course with this title already exists.'
            });
        }

        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Internal Server Error',
        });
    }
};

// ADD TOPIC TO EXISTING COURSE
exports.addTopicToCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const topicData = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                ok: false,
                type: 'NotFoundError',
                message: 'Course not found'
            });
        }

        // Calcular el orden automáticamente si no viene
        if (!topicData.order) {
            topicData.order = course.topics.length;
        }

        course.topics.push(topicData);
        await course.save();

        res.status(200).json({
            ok: true,
            data: course,
            message: 'Topic added successfully'
        });
    } catch (error) {
        console.error('--- ADD TOPIC ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Error adding topic to course'
        });
    }
};

// ADD VIDEO TO EXISTING TOPIC
exports.addVideoToTopic = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { topicIndex, video } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                ok: false,
                type: 'NotFoundError',
                message: 'Course not found'
            });
        }

        if (topicIndex >= course.topics.length) {
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                message: 'Topic index out of range'
            });
        }

        // Calcular el orden automáticamente
        if (!video.order) {
            video.order = course.topics[topicIndex].videos.length;
        }

        course.topics[topicIndex].videos.push(video);
        await course.save();

        res.status(200).json({
            ok: true,
            data: course,
            message: 'Video added successfully'
        });
    } catch (error) {
        console.error('--- ADD VIDEO ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Error adding video to topic'
        });
    }
};

// UPDATE COURSE (general)
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updateData = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                ok: false,
                type: 'NotFoundError',
                message: 'Course not found'
            });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            ok: true,
            data: updatedCourse,
            message: 'Course updated successfully'
        });
    } catch (error) {
        console.error('--- UPDATE COURSE ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Error updating course'
        });
    }
};

// DELETE COURSE
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({
                ok: false,
                type: 'NotFoundError',
                message: 'Course not found'
            });
        }

        res.status(200).json({
            ok: true,
            data: { id: courseId },
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('--- DELETE COURSE ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Error deleting course'
        });
    }
};

// CREATE TUTORIAL
exports.createTutorial = async (req, res) => {
    try {
        const tutorialData = req.body;
        
        const newTutorial = await Tutorial.create(tutorialData);

        res.status(201).json({
            ok: true,
            data: newTutorial,
            message: 'Tutorial created successfully'
        });
    } catch (error) {
        console.error('--- CREATE TUTORIAL ERROR ---', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                type: 'DuplicateError',
                message: 'A tutorial with this title already exists.'
            });
        }

        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Internal Server Error',
        });
    }
};

// UPDATE TUTORIAL
exports.updateTutorial = async (req, res) => {
    try {
        const { tutorialId } = req.params;
        const updateData = req.body;

        const tutorial = await Tutorial.findById(tutorialId);
        if (!tutorial) {
            return res.status(404).json({
                ok: false,
                type: 'NotFoundError',
                message: 'Tutorial not found'
            });
        }

        const updatedTutorial = await Tutorial.findByIdAndUpdate(
            tutorialId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            ok: true,
            data: updatedTutorial,
            message: 'Tutorial updated successfully'
        });
    } catch (error) {
        console.error('--- UPDATE TUTORIAL ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Error updating tutorial'
        });
    }
};

// DELETE TUTORIAL
exports.deleteTutorial = async (req, res) => {
    try {
        const { tutorialId } = req.params;

        const tutorial = await Tutorial.findByIdAndDelete(tutorialId);
        if (!tutorial) {
            return res.status(404).json({
                ok: false,
                type: 'NotFoundError',
                message: 'Tutorial not found'
            });
        }

        res.status(200).json({
            ok: true,
            data: { id: tutorialId },
            message: 'Tutorial deleted successfully'
        });
    } catch (error) {
        console.error('--- DELETE TUTORIAL ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Error deleting tutorial'
        });
    }
};