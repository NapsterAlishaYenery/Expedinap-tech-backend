// templates/emailTemplates.js

const COMPANY = {
    name: "ExpediNap Tech",
    website: process.env.COMPANY_WEBSITE || "https://expedinap.tech",
    email: process.env.COMPANY_EMAIL || "contacto@expedinap.tech",
    phone: process.env.COMPANY_PHONE || "+18098369303",
    logo: "https://res.cloudinary.com/dfwpolska/image/upload/v1778852126/logo.png"
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const buildContactFormTemplate = (contactData, isAdmin = false) => {
    const { fullName, email, phone, message } = contactData;
    const dateStr = formatDate(new Date());
    const timestamp = new Date().getTime().toString().slice(-6);

    const titleText = isAdmin ? "🔔 NEW CONTACT INQUIRY" : "📬 WE'VE RECEIVED YOUR MESSAGE";
    const greetingText = isAdmin
        ? "You have a new message from your portfolio website:"
        : "Thank you for reaching out to ExpediNap Tech!";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ExpediNap Tech | ${isAdmin ? 'New Contact' : 'Message Received'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            margin: 0;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        /* Header con gradiente tech */
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            padding: 40px 30px;
            text-align: center;
            border-bottom: 4px solid #f97316;
        }
        
        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 20px;
        }
        
        .header h1 {
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 10px;
            opacity: 0.8;
        }
        
        /* Status bar */
        .status-bar {
            background: #f8fafc;
            padding: 12px 24px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            text-align: right;
            font-family: 'Courier New', monospace;
        }
        
        /* Content */
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .greeting h2 {
            color: #0f172a;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .greeting p {
            color: #64748b;
            font-size: 14px;
        }
        
        /* Section title */
        .section-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #f97316;
            margin-bottom: 15px;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 8px;
        }
        
        /* Info card */
        .info-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .info-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .info-row:last-child {
            margin-bottom: 0;
        }
        
        .info-icon {
            width: 32px;
            height: 32px;
            background: #ffffff;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .info-content {
            flex: 1;
        }
        
        .info-label {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }
        
        .info-value {
            font-size: 15px;
            font-weight: 600;
            color: #0f172a;
            word-break: break-word;
        }
        
        .info-value a {
            color: #f97316;
            text-decoration: none;
        }
        
        .info-value a:hover {
            text-decoration: underline;
        }
        
        /* Message box */
        .message-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 20px;
            margin-top: 10px;
            border-left: 4px solid #f97316;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        
        .message-box p {
            color: #334155;
            font-size: 14px;
            line-height: 1.7;
            font-style: italic;
        }
        
        /* Code block decorative */
        .code-decoration {
            background: #0f172a;
            border-radius: 12px;
            padding: 12px 16px;
            margin: 25px 0;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #94a3b8;
            overflow-x: auto;
        }
        
        .code-decoration span {
            color: #f97316;
        }
        
        /* Button */
        .btn-reply {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 40px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);
        }
        
        .btn-reply:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
        }
        
        /* Footer */
        .footer {
            background: #0f172a;
            color: #94a3b8;
            padding: 30px;
            text-align: center;
            font-size: 12px;
        }
        
        .footer strong {
            color: #ffffff;
            font-size: 14px;
        }
        
        .footer a {
            color: #f97316;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .social-links {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        
        .social-links a {
            color: #64748b;
            font-size: 14px;
        }
        
        /* Responsive */
        @media (max-width: 480px) {
            .container {
                border-radius: 16px;
            }
            .content {
                padding: 25px 20px;
            }
            .header {
                padding: 30px 20px;
            }
            .logo {
                max-width: 140px;
            }
            .greeting h2 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="${COMPANY.logo}" alt="ExpediNap Tech" class="logo">
            <h1>Full Stack Development</h1>
        </div>
        
        <!-- Status Bar -->
        <div class="status-bar">
            ${titleText} • ${dateStr} • Ref: #${timestamp}
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                <h2>${isAdmin ? '🔔 New Contact' : '📬 Message Received'}</h2>
                <p>${greetingText}</p>
            </div>
            
            <!-- Code decoration (tech vibe) -->
            <div class="code-decoration">
                <span>&gt;</span> contact.submit({<br>
                &nbsp;&nbsp;name: "${fullName.split(' ')[0]}",<br>
                &nbsp;&nbsp;timestamp: "${dateStr}"<br>
                });
            </div>
            
            <!-- Contact Information -->
            <div class="section-title">📋 CONTACT INFORMATION</div>
            <div class="info-card">
                <div class="info-row">
                    <div class="info-icon">👤</div>
                    <div class="info-content">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">${fullName}</div>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-icon">📧</div>
                    <div class="info-content">
                        <div class="info-label">Email Address</div>
                        <div class="info-value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                </div>
                ${phone ? `
                <div class="info-row">
                    <div class="info-icon">📱</div>
                    <div class="info-content">
                        <div class="info-label">Phone / WhatsApp</div>
                        <div class="info-value"><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}">${phone}</a></div>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- Message -->
            <div class="section-title">💬 MESSAGE</div>
            <div class="message-box">
                <p>“${message.replace(/\n/g, '<br>')}”</p>
            </div>
            
            <!-- Action Button (solo para admin) -->
            ${isAdmin ? `
            <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${email}" class="btn-reply">
                    ✉️ REPLY TO CUSTOMER
                </a>
                <p style="font-size: 11px; color: #94a3b8; margin-top: 12px;">
                    ⚡ Typically responds within 24 hours
                </p>
            </div>
            ` : `
            <div style="text-align: center; margin-top: 20px;">
                <p style="font-size: 13px; color: #64748b;">
                    🚀 We typically respond within 24 hours.<br>
                    Our team is excited to help you with your project!
                </p>
            </div>
            `}
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <strong>${COMPANY.name}</strong><br>
            Full Stack Development • Angular • Node.js • MongoDB<br>
            <a href="${COMPANY.website}">${COMPANY.website.replace('https://', '')}</a>
            <div class="social-links">
                <a href="#">GitHub</a>
                <a href="#">LinkedIn</a>
                <a href="#">Twitter</a>
            </div>
            <p style="margin-top: 20px; font-size: 10px; opacity: 0.6;">
                © ${new Date().getFullYear()} ${COMPANY.name}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = { buildContactFormTemplate, COMPANY };