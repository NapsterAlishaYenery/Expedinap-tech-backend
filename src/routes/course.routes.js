// src/routes/course.routes.js
const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/course.controller');
const authMiddleware = require('../middleware/auth.middleware');
const isAdminMiddleware = require('../middleware/isAdmin.middleware');
const writeLimiter = require('../middleware/rateLimiter.middleware');
const validateCourse = require('../middleware/course-validator.middleware');

// RUTAS PÚBLICAS
router.get('/courses', coursesController.getAllCourses);
router.get('/courses/:slug', coursesController.getCourseBySlug);
router.get('/tutorial', coursesController.getAllTutorials);
router.get('/tutorial/featured', coursesController.getFeaturedTutorials);
router.get('/tutorial/:slug', coursesController.getTutorialBySlug);

// RUTAS ADMIN (CREAR, ACTUALIZAR, ELIMINAR)
// Cursos - CRUD completo
router.post(
    '/courses',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    validateCourse.create,
    coursesController.createCourse
);

router.patch(
    '/courses/:courseId',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    validateCourse.update,
    coursesController.updateCourse
);

router.delete(
    '/courses/:courseId',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    coursesController.deleteCourse
);

// Agregar tema a curso existente
router.post(
    '/courses/:courseId/topics',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    validateCourse.addTopic,
    coursesController.addTopicToCourse
);

// Agregar video a tema existente
router.post(
    '/courses/:courseId/videos',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    validateCourse.addVideoToTopic,
    coursesController.addVideoToTopic
);

// Tutoriales - CRUD completo
router.post(
    '/tutorials',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    validateCourse.createTutorial, 
    coursesController.createTutorial
);

router.patch(
    '/tutorials/:tutorialId',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    validateCourse.updateTutorial,  
    coursesController.updateTutorial
);

router.delete(
    '/tutorials/:tutorialId',
    authMiddleware,
    isAdminMiddleware,
    writeLimiter,
    coursesController.deleteTutorial
);

module.exports = router;