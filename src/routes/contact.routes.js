// routes/contact.routes.js
const express = require('express');
const router = express.Router();

const writeLimiter = require('../middleware/rateLimiter.middleware'); 
const controllerContact  = require('../controllers/contact.controller');

router.post('/', writeLimiter, controllerContact.createContact);

module.exports = router;