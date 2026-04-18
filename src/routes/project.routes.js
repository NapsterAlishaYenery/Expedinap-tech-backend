const express = require('express');
const router = express.Router();

// 1. IMPORTAMOS TU CONFIGURACIÓN DE MULTER (El validador de imágenes que pusiste al final)
const upload = require('../middleware/upload.middleware');

// 2. IMPORTAMOS LOS DEMÁS MIDDLEWARES
const validateGlobalID = require('../middleware/validate-id.middleware');
const validateProject = require('../middleware/project-validator.middleware');

// 3. IMPOERTAMOS EL CONTROLADOR
const projectController = require('../controllers/project.controller');

// nuevos middlewares 
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
    // Esto se ejecuta para PATCH y para DELETE
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