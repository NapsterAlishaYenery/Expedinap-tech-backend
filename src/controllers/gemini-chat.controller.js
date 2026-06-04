const { generateChatResponse } = require('../services/gemini.service');

exports.handledChatGeminiIA = async (req, res) => {
    try {

        const { message } = req.body;
        const { history } = req.body; 
        if (!message) {
            return res.status(400).json({
                ok: false,
                message: 'Message cant be null or undefined',
                type: 'BadRequest',
                data: null
            });
        }

        // Le pasamos el historial (si no existe, enviamos [])
        const iAResponse = await generateChatResponse(message, history || []);

        return res.status(200).json({
            ok: true,
            message: 'IA Response',
            data: iAResponse
        });

    } catch (error) {
        console.error('--- HANDLED_CHAT_GEMINI_IA ERROR ---', error);
        return res.status(500).json({
            ok: false,
            message: 'Internal Server Error',
            type: 'InternalServerError',
            data: null
        });

    }

}