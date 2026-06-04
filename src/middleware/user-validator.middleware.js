const Joi = require('joi');

/**
 * Esquema base de Usuario.
 * Define las reglas estrictas para el registro.
 */
const joiUserSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'any.required': 'First name is required',
        'string.min': 'Name must be at least 2 characters long'
    }),
    lastname: Joi.string().min(2).max(50).required().messages({
        'any.required': 'Last name is required'
    }),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'any.required': 'Username is required',
        'string.alphanum': 'Username must only contain alphanumeric characters'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
    }),
    // La dirección es un objeto opcional
    address: Joi.object({
        street: Joi.string().allow(''),
        city: Joi.string().allow(''),
        province: Joi.string().allow(''),
        zip_code: Joi.string().allow('')
    }).optional()
});

const validateUser = {
    
    signUp: (req, res, next) => {
        const { error } = joiUserSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                data: null,
                type: 'ValidationError',
                messages: errors 
            });
        }
        next();
    },

   
    login: (req, res, next) => {
        const schema = Joi.object({
            identifier: Joi.string().required().messages({ 'any.required': 'Email or Username is required' }),
            password: Joi.string().required().messages({ 'any.required': 'Password is required' })
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                ok: false,
                data: null,
                type: 'ValidationError',
                message: error.details[0].message
            });
        }
        next();
    },

    update: (req, res, next) => {
        let updateSchema = joiUserSchema.fork(
            Object.keys(joiUserSchema.describe().keys),
            (schema) => schema.optional()
        );
        
        updateSchema = updateSchema.append({
            _id: Joi.any().forbidden(),
            createdAt: Joi.any().forbidden(),
            updatedAt: Joi.any().forbidden(),
            password: Joi.any().forbidden().messages({ 'any.unknown': 'Use the password recovery flow to change your password' }),
            email: Joi.any().forbidden().messages({ 'any.unknown': 'Email cannot be changed manually' }),
            username: Joi.any().forbidden().messages({ 'any.unknown': 'Username is permanent' }),
            role: Joi.any().forbidden().messages({ 'any.unknown': 'Only an admin can change roles' }),
            active: Joi.any().forbidden().messages({ 'any.unknown': 'Use the deactivation endpoint to change account status' })
        });

        const { error } = updateSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                data: null,
                type: 'ForbiddenFieldError',
                messages: errors
            });
        }

       
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                ok: false,
                data: null,
                type: 'EmptyRequest',
                message: "Please provide at least one field to update (name, lastname or address)"
            });
        }

        next();
    }
};

module.exports = validateUser;