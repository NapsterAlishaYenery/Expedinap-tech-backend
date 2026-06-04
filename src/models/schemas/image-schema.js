
const { Schema} = require('mongoose');

const ImageSchema = new Schema({
    public_id: {
        type: String,
        required: [true, 'Full Id is required'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true,
    },
    alt: {
        type: String,
        required: [true, 'Alt (Texto alternativo) is required'],
        trim: true,
        default: 'Project capture ExpediNap Tech'
    }
}, { _id: false }); 

module.exports = ImageSchema;