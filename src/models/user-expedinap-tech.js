const { Schema, model } = require("mongoose");
const AddressSchema = require("./schemas/user-address-schema");
const ImageSchema = require("./schemas/image-schema"); // Reutilizamos el de ayer
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [emailRegex, 'Please provide a valid email address']
    },
    password: { // Cambiado de password_hash a password por simplicidad, pero con select: false
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    // --- MEJORA PRO: Imagen de perfil con lo que ya sabes ---
    avatar: ImageSchema,
    role: {
        type: String,
        enum: ['admin', 'editor', 'user'], // Añadimos 'editor' por si quieres ayuda en el blog
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },

    address: AddressSchema, // Usamos el sub-schema

    // --- MEJORA PRO: Metadata de cuenta ---
    lastLogin: {
        type: Date
    }
}, {
    versionKey: false,
    timestamps: true
});

// Middleware para transformar la respuesta (Ocultar datos sensibles)
UserSchema.methods.toJSON = function() {

    const { password, ...user } = this.toObject();

    return user;

};

module.exports = model("users", UserSchema);