// src/models/schemas/topic.schema.js
const mongoose = require('mongoose');
const VideoSchema = require('./video.schema');

const TopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Topic title is required']
    },
    description: {
        type: String,
        default: ''
    },
    videos: [VideoSchema],
    order: {
        type: Number,
        default: 0
    }
}, { 
    _id: true,
    timestamps: false 
});

module.exports = TopicSchema;