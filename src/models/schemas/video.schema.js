
const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Video title is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    youtubeUrl: {
        type: String,
        required: [true, 'YouTube URL is required'],
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v);
            },
            message: 'Invalid YouTube URL'
        }
    },
    // ID extraído de la URL para el iframe
    youtubeId: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // en minutos
        default: 0
    },
    order: {
        type: Number, // orden dentro del curso/tema
        default: 0
    },
    isFree: {
        type: Boolean,
        default: false // si es gratuito o solo para suscriptores
    },
    thumbnail: {
        type: String, // URL de thumbnail personalizada 
        default: ''
    }
}, { _id: true, timestamps: true });

module.exports = VideoSchema;