const { Types } = require('mongoose');

const validateGlobalID = {
    /**
     * Middleware para la Verificacion de los ID.
     * Types.ObjectId.isValid es una función de Mongoose 
     */
    id : (req, res, next) => {
    const { id } = req.params;

    // Types.ObjectId.isValid es una función de Mongoose 
    // que revisa si el string tiene el formato correcto de MongoDB
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            type: 'ValidationError',
            message: 'El ID enviado no es un ID de MongoDB válido.'
        });
    }

    next(); // Si es válido, sigue a la ruta
}
};

module.exports = validateGlobalID;