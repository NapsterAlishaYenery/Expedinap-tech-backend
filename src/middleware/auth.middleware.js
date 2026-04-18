
const jwt = require("jsonwebtoken");
const User = require("../models/user-expedinap-tech"); // Importamos el modelo

const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            ok: false,
            type: 'NoTokenProvided',
            data: null,
            message: 'Unauthorized: Token not provided'
        });
    }

    const token = authHeader.split(' ')[1];


    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // BUSCAMOS AL USUARIO EN BD: Para asegurar que no fue borrado o desactivado
        const user = await User.findById(decoded.id);

        if (!user || !user.active) {
            return res.status(401).json({
                ok: false,
                type: 'UserStatusError',
                data: null,
                message: 'User does not exist or is disabled'
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ 
            ok: false,
            type: 'InvalidToken',
            data: null,
            message: 'Invalid Token o TokenExpired' 
        });
    }
};

module.exports = authMiddleware;