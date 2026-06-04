// src/middleware/course-validator.middleware.js
const Joi = require('joi');


const videoSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(500).allow(''),
    youtubeUrl: Joi.string().uri().required(),
    youtubeId: Joi.string().required(),
    duration: Joi.number().integer().min(0).default(0),
    order: Joi.number().integer().min(0).default(0),
    isFree: Joi.boolean().default(false),
    thumbnail: Joi.string().uri().allow('')
});


const topicSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).allow(''),
    videos: Joi.array().items(videoSchema).default([]),
    order: Joi.number().integer().min(0).default(0)
});


const createCourseSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    level: Joi.string().valid('beginner', 'intermediate', 'advanced', 'all-levels').default('beginner'),
    category: Joi.string().valid('angular', 'nodejs', 'mongodb', 'typescript', 'tailwind', 'fullstack').required(),
    image: Joi.string().uri().required(),
    topics: Joi.array().items(topicSchema).default([]),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
    isFeatured: Joi.boolean().default(false),
    price: Joi.number().min(0).default(0)
});


const updateCourseSchema = createCourseSchema.fork(
    Object.keys(createCourseSchema.describe().keys),
    (schema) => schema.optional()
).append({
    _id: Joi.any().forbidden(),
    slug: Joi.any().forbidden(),
    createdAt: Joi.any().forbidden(),
    updatedAt: Joi.any().forbidden(),
    totalVideos: Joi.any().forbidden(),
    totalDuration: Joi.any().forbidden()
});

const addTopicSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).allow(''),
    videos: Joi.array().items(videoSchema).default([]),
    order: Joi.number().integer().min(0).default(0)
});

const addVideoToTopicSchema = Joi.object({
    topicIndex: Joi.number().integer().min(0).required(),
    video: videoSchema.required()
});


const createTutorialSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().valid('angular', 'nodejs', 'mongodb', 'typescript', 'tailwind', 'general').required(),
    tags: Joi.array().items(Joi.string()).default([]),
    video: videoSchema.required(),
    image: Joi.string().uri().allow(''),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
    isFeatured: Joi.boolean().default(false)
});

const updateTutorialSchema = createTutorialSchema.fork(
    Object.keys(createTutorialSchema.describe().keys),
    (schema) => schema.optional()
).append({
    _id: Joi.any().forbidden(),
    slug: Joi.any().forbidden(),
    createdAt: Joi.any().forbidden(),
    updatedAt: Joi.any().forbidden()
});


const validateCourse = {
    // Cursos
    create: (req, res, next) => {
        const { error } = createCourseSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                messages: errors
            });
        }
        next();
    },
    update: (req, res, next) => {
        const { error } = updateCourseSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                messages: errors
            });
        }
        next();
    },
    addTopic: (req, res, next) => {
        const { error } = addTopicSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                messages: errors
            });
        }
        next();
    },
    addVideoToTopic: (req, res, next) => {
        const { error } = addVideoToTopicSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                messages: errors
            });
        }
        next();
    },
    // Tutoriales
    createTutorial: (req, res, next) => {
        const { error } = createTutorialSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                messages: errors
            });
        }
        next();
    },
    updateTutorial: (req, res, next) => {
        const { error } = updateTutorialSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                messages: errors
            });
        }
        next();
    }
};

module.exports = validateCourse;