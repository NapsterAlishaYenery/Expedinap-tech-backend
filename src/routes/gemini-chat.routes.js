const express = require('express');
const router = express.Router();

const geminiController = require('../controllers/gemini-chat.controller');


router.post('/ask', geminiController.handledChatGeminiIA);

module.exports = router;