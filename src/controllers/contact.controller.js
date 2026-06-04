// controllers/contact.controller.js
const { enviarEmail } = require('../services/email.service');
const { buildContactFormTemplate } = require('../templates/emailTemplates');

exports.createContact = async (req, res) => {
    try {
        const contactData = req.body;

        // Validación básica
        if (!contactData.fullName || !contactData.email || !contactData.message) {
            return res.status(400).json({
                ok: false,
                message: 'Missing required fields: fullName, email, message'
            });
        }

        const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false });
        const refNumber = new Date().getTime().toString().slice(-6);

        // Email para el ADMIN (a tu correo del .env)
        const htmlAdmin = buildContactFormTemplate(contactData, true);
        await enviarEmail({
            to: process.env.CONTACT_EMAIL_RECEIVER,
            subject: `🚨 NEW CONTACT: ${contactData.fullName} <${contactData.email}> [${timestamp}]`,
            html: htmlAdmin
        });

        // Email para el CLIENTE (confirmación)
        const htmlClient = buildContactFormTemplate(contactData, false);
        await enviarEmail({
            to: contactData.email,
            subject: `Thank you for contacting ExpediNap Tech #${refNumber}`,
            html: htmlClient
        });

        // Respuesta al frontend (solo los datos del cliente)
        return res.status(200).json({
            ok: true,
            message: 'Message sent successfully',
            data: contactData
        });

    } catch (error) {
        console.error('[CONTACT-ERROR]:', error.message);

        res.status(500).json({
            ok: false,
            message: 'Internal server error. Please try again later.',
            type: 'SERVER_ERROR'
        });
    }
};
