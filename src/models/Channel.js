// src/models/Channel.model.js
const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'ExpediNap Tech'
    },
    description: {
        type: String,
        default: 'Full Stack Development tutorials and courses'
    },
    avatar: {
        type: String, 
        default: 'https://res.cloudinary.com/dfwpolska/image/upload/v1778852126/logo.png'
    },
    banner: {
        type: String, 
        default: ''
    },
    youtubeUrl: {
        type: String,
        default: 'https://youtube.com/@ExpediNap'
    },
    githubUrl: {
        type: String,
        default: 'https://github.com/Expediap'
    },
    subscribers: {
        type: Number,
        default: 0
    },
    totalVideos: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Channel', ChannelSchema);