
const { Schema} = require('mongoose');

const LinksSchema = new Schema({
    live: {
        type: String,
        trim: true
    },
    github: {
        type: String,
        trim: true
    },
    demoVideo: {
        type: String,
        trim: true,
    }
}, { _id: false }); 

module.exports = LinksSchema;