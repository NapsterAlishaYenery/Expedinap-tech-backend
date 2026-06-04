const express = require('express');
const router = express.Router();

// IMPORTAMOS CONFIGURACIÓN DE MULTER 
const upload = require('../middleware/upload.middleware');

// IMPORTAMOS LOS MIDDLEWARES
const validateGlobalID = require('../middleware/validate-id.middleware');
const validateProject = require('../middleware/project-validator.middleware');

// IMPOERTAMOS EL CONTROLADOR
const projectController = require('../controllers/project.controller');

// MIDDLEWARES
const authMiddleware = require('../middleware/auth.middleware'); 
const writeLimiter = require('../middleware/rateLimiter.middleware'); 
const isAdminMiddleware = require('../middleware/isAdmin.middleware');

/**
 * RUTAS PÚBLICAS (Para ver los proyectos)
 */
router.get('/', projectController.getAllProjects);
router.get('/slug/:slug', projectController.getBySlugProject);

/**
 * RUTA DE CREACIÓN (POST)
 */

// Primero Multer atrapa las fotos y las mete en la carpeta /uploads
// Luego Joi valida que el título, descripción, etc., estén bien
// Si todo está bien, el controlador las sube a Cloudinary y guarda en DB
router.post(
    '/',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'gallery', maxCount: 6 }]),
    validateProject.create,
    projectController.createProject
);

/**
 * RUTAS QUE DEPENDEN DEL ID (Update y Delete)
 */
router.route('/:id')
    .all(validateGlobalID.id, authMiddleware)
    // HTTP PATCH
    .patch(
        isAdminMiddleware,
        writeLimiter,
        upload.fields([
            { name: 'mainImage', maxCount: 1 },
            { name: 'gallery', maxCount: 6 }
        ]),
        validateProject.update,
        projectController.updateProject
    )
    // HTTP DELETE 
    .delete(
        isAdminMiddleware,
        writeLimiter,
        projectController.deleteProject);

module.exports = router;