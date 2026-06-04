const { Schema, model } = require('mongoose');
const slugify = require('slugify');
const LinksSchema = require('./schemas/proyects-links-schemas');
const ImageSchema = require('./schemas/image-schema');

const stringArrayValidator = require('../utils/string-array.validator');
const ALLOWED_STACKS = require('../constant/tech-learned')

const ProyectsSchemas = new Schema({
    title: {
        type: String,
        required: [true, 'Title of the project is required'],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required for SEO URLs'],
        unique: true,
        lowercase: true,
        trim: true
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description of the project is required'],
        trim: true
    },
    longDescription: {
        type: String,
        required: [true, 'Long description of the project is required'],
        trim: true
    },
    category: {
        type: [String],
        lowercase: true,
        enum: ['web-app', 'mobile-app', 'api-rest', 'ecommerce', 'landing-page'],
        required: [true, 'At least one category is required'],
        validate: stringArrayValidator()
    },
    stacks: {
        type: [String],
        lowercase: true,
        required: [true, 'At least one stack is required'],
        enum: {
            values: ALLOWED_STACKS,
            message: '{VALUE} is not a supported technology yet'
        },
        validate: stringArrayValidator()
    },
    developmentYear: {
        type: Number,
        default: new Date().getFullYear()
    },
    mainImage: ImageSchema,
    gallery: [ImageSchema],
    links: LinksSchema,
    status: {
        isFeatured: {
            type: Boolean,
            default: false
        },
        isVisible: {
            type: Boolean,
            default: true
        }
    }
},
    { timestamps: true });

ProyectsSchemas.pre('validate', function () {

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

module.exports = model('projects', ProyectsSchemas);