// src/models/Tutorial.model.js
const mongoose = require('mongoose');
const slugify = require('slugify');
const VideoSchema = require('./schemas/video.schema');

const TutorialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tutorial title is required'],
        trim: true
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
        required: [true, 'Tutorial description is required']
    },
    category: {
        type: String,
        enum: ['angular', 'nodejs', 'mongodb', 'typescript', 'tailwind', 'general'],
        required: true
    },
    tags: [{ type: String, trim: true }],
    video: {
        type: VideoSchema,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// GENERADOR DE SLUG para Tutorial
TutorialSchema.pre('validate', function() {
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

module.exports = mongoose.model('Tutorial', TutorialSchema);