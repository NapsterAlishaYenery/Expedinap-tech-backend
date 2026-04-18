
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
}, { _id: false }); // _id: false para que no cree un ID por cada imagen de la galería

module.exports = LinksSchema;