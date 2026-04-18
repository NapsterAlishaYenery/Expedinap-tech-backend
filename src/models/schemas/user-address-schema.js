const { Schema } = require("mongoose");

const AddressSchema = new Schema({
    street: { 
        type: String, 
        trim: true },
    city: { 
        type: String, 
        trim: true },
    province: { 
        type: String, 
        trim: true }, 
    zip_code: { 
        type: String, 
        trim: true }
}, { _id: false });

module.exports = AddressSchema;