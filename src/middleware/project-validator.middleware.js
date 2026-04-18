
const Joi = require('joi');

/**
 * Esquema base de validación para Proyectos.
 * Aquí definimos las reglas de "oro" para cada campo de texto.
 */

const joiProjectsValidatorSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'The title must be at least 3 characters long',
            'string.max': 'The title must have maximun of 100 characters long',
            'any.required': 'Title is required'
        }),
    shortDescription: Joi.string()
        .min(10)
        .max(250)
        .required()
        .messages({
            'string.min': 'The short description must be at least 10 characters long',
            'string.max': 'The short description must have maximun of 250 characters long',
            'any.required': 'Short Description is required'
        }),
    longDescription: Joi.string()
        .required()
        .messages({
            'any.required': 'Short Description is required'
        }),

    category: Joi.array()
        .items(
            Joi.string().valid('web-app', 'mobile-app', 'api-rest', 'ecommerce', 'landing-page')
        )
        .min(1)
        .required()
        .messages({
            'any.only': 'The selected category is invalid'
        }),

    stacks: Joi.array()
        .items(Joi.string())
        .min(1)
        .required()
        .messages({
            'any.only': 'The selected category is invalid'
        }),

    developmentYear: Joi.number()
        .integer()
        .min(2020)
        .max(new Date().getFullYear())
        .default(new Date().getFullYear()),

        // AQUÍ AGREGAMOS EL OBJETO LINKS
    links: Joi.object({
        live: Joi.string().uri().allow(''),
        github: Joi.string().uri().allow(''),
        demoVideo: Joi.string().uri().allow('')
    }).optional() // Lo ponemos como opcional por si algún proyecto no tiene links

    // Nota: mainImage y gallery no se validan aquí porque Multer las procesa aparte.
    // Joi solo valida req.body (lo que viene como texto).
});


const validateProject = {
    /**
     * Middleware para la CREACIÓN.
     * Exige que todos los campos marcados como .required() estén presentes.
     */
    create: (req, res, next) => {
        // Ejecutamos la validación sobre el cuerpo de la petición
        const { error } = joiProjectsValidatorSchema.validate(req.body, { abortEarly: false });

        if (error) {
            // Recogemos todos los errores y los devolvemos en un array limpio
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                messages: errors
            });
        }

        next(); // Si todo está bien, pasamos al controlador
    },

    /**
     * Middleware para la ACTUALIZACIÓN (Update).
     * Aquí no exigimos todos los campos, pero si mandas uno, debe cumplir la regla.
     */
    update: (req, res, next) => {
        /**
         * .fork() es una función avanzada de Joi que toma las llaves del esquema base
         * y les cambia una propiedad. Aquí les decimos: "Todas ahora son opcionales".
         */
        const updateSchema = joiProjectsValidatorSchema.fork(
            Object.keys(joiProjectsValidatorSchema.describe().keys),
            (schema) => schema.optional()
        );

        // 2. Agregamos campos prohibidos expresamente
        // Si el usuario manda alguno de estos, Joi lanzará un error
        updateSchema = updateSchema.append({
            _id: Joi.any().forbidden().messages({ 'any.unknown': 'No puedes modificar el campo _id manualmente' }),
            slug: Joi.any().forbidden().messages({ 'any.unknown': 'El slug se genera automáticamente, no puedes enviarlo' }),
            createdAt: Joi.any().forbidden(),
            updatedAt: Joi.any().forbidden()
        });

        const { error } = updateSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                ok: false,
                type: 'ValidationError',
                messages: errors
            });
        }

        next();
    }
};

module.exports = validateProject;