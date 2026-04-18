const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const validateUser = require('../middleware/user-validator.middleware');
const validateGlobalID = require('../middleware/validate-id.middleware');
const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware'); 
const writeLimiter = require('../middleware/rateLimiter.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');

/**
 * RUTAS PÚBLICAS / AUTH
 */
router.post('/signup', writeLimiter, upload.single('avatar'), validateUser.signUp, userController.signUp);
router.post('/login', writeLimiter, validateUser.login, userController.login);

/**
 * RUTAS DEL PERFIL (Usan el ID del Token)
 */
router.patch('/update-my-profile', authMiddleware, writeLimiter, upload.single('avatar'), validateUser.update, userController.updateUser);

/**
 * RUTAS ADMINISTRATIVAS (Aquí sí se usa ID)
 */
router.route('/:id')
    .all(validateGlobalID.id, authMiddleware, isAdmin)
    .get(userController.getUserById) // Tú como admin viendo a un usuario
    .delete(writeLimiter, userController.deleteUserById); // Tú borrando a alguien

module.exports = router;