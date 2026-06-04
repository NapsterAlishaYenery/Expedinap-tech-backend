// src/models/schemas/course.schema.js
const mongoose = require('mongoose');
const VideoSchema = require('./video.schema');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required']
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
        default: 'beginner'
    },
    category: {
        type: String,
        enum: ['angular', 'nodejs', 'mongodb', 'typescript', 'tailwind', 'fullstack'],
        required: true
    },
    image: {
        type: String, 
        required: [true, 'Course image is required']
    },
    
    topics: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        videos: [VideoSchema], 
        order: Number
    }],
    totalVideos: {
        type: Number,
        default: 0
    },
    totalDuration: {
        type: Number, 
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0 
    }
}, { timestamps: true });

// Middleware para calcular estadísticas antes de guardar
CourseSchema.pre('save', function(next) {
    let totalVideos = 0;
    let totalDuration = 0;
    
    this.topics.forEach(topic => {
        totalVideos += topic.videos.length;
        topic.videos.forEach(video => {
            totalDuration += video.duration || 0;
        });
    });
    
    this.totalVideos = totalVideos;
    this.totalDuration = totalDuration;
    next();
});

module.exports = CourseSchema;