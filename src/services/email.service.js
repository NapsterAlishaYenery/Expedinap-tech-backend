const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true, // true para puerto 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


/**
 * Enviar email genérico
 * @param {Object} options - { to, subject, html, bcc }
 */

const enviarEmail = async (options) => {
    const { to, subject, html, bcc } = options;

    const mailOptions = {
        from: `"ExpediNap Tech" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: html,
        bcc: bcc || process.env.BCC_EMAIL
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`❌ Email error to ${to}:`, error.message);
        throw error;
    }
};

module.exports = { enviarEmail };