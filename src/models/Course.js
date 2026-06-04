// src/models/Course.model.js
const mongoose = require('mongoose');
const slugify = require('slugify');
const VideoSchema = require('./schemas/video.schema');
const TopicSchema = require('./schemas/topic.schema');

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
    topics: [TopicSchema],
    totalVideos: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: { type: Boolean, default: false },
    price: { type: Number, default: 0 }
}, { timestamps: true });

// GENERADOR DE SLUG para Course
CourseSchema.pre('validate', function() {
    if (this.isNew && this.title && !this.slug) {
        let baseSlug = slugify(this.title, { lower: true, strict: true });
        
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        this.slug = `${baseSlug}-${dateString}`;
    }
});

// Middleware para calcular estadísticas
CourseSchema.pre('save', function() {
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
});

module.exports = mongoose.model('Course', CourseSchema);