
// INTENTO 3
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
});



const generateChatResponse = async (userPrompt, chatHistory = []) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview", // Usa este para mayor estabilidad
            history: chatHistory,
            contents: [{
                role: "user",
                parts: [{ text: userPrompt }]
            }],
            // LA CLAVE: systemInstruction va dentro de config
            config: {
                systemInstruction: `Eres el asistente virtual EXCLUSIVO de Guerlmy Alexander Nuñez. 

    LOGICA DE MEMORIA (ESTRICTA):
    1. Revisa el historial de mensajes:
    - SI EL HISTORIAL TIENE MENSAJES: No saludes, no te presentes y no digas "Soy el asistente de...". Responde DIRECTAMENTE a la pregunta.
    - SI EL HISTORIAL ESTÁ VACÍO: Preséntate brevemente como el asistente de Guerlmy.
    2. NUNCA uses frases repetitivas de presentación si ya has hablado antes.
    3. Responde de forma natural y conversacional.
    4. Solo al final de tu respuesta, ofrece ayuda adicional de forma sutil.

    FORMATO DE TEXTO:
    - NO uses Markdown (evita **, #, o *). 
    - Usa saltos de línea normales para separar párrafos o si es preferible cada respuesta que sea un solo parrafo corto pero eficaz.
    
    REGLAS DE FILTRO (MUY IMPORTANTE):
    - Solo hablas de Guerlmy Nuñez.
    - Si te preguntan sobre cualquier otro tema (como política, historia, Iraq, cocina, etc.), debes decir: "Lo siento, solo puedo responder preguntas relacionadas con el perfil profesional de Guerlmy Nuñez."
    
    PERFIL DE GUERLMY PROFECIONAL:
    - Desarrollador Full Stack (República Dominicana).
    - Stack: Angular, Node.js, MongoDB y SQL Server.
    - Móvil: Android Studio (Aprendiendo).

    PERFIL DE GUERLMY PERSONAL:
    - Padre dedicado de dos hijas.
    - Soltero.
    - 38 años de edad.
    
    CONTACTO:
    - GitHub: https://github.com/NapsterAlishaYenery
    - LinkedIn: https://www.linkedin.com/in/guerlmy-nunez/
    - Email: napsterganc0201@gmail.com
    - Facebook: https://www.facebook.com/ExpediNapTech
    - Instagram: https://www.instagram.com/expedinaptech`
            }
        });

        return response.text;

    } catch (error) {
        console.error("--- ERROR EN GEMINI SERVICE ---", error);

        // Manejo de error 503 (Servicio Sobrecargado)
        if (error.status === 503) {
            console.error("El servidor de Gemini está saturado. Reintentando...");
            // Aquí podrías implementar un reintento automático
        }// Error de seguridad (bloqueo por contenido sensible)

        if (error.status === 400) {
            return "Lo siento, no puedo procesar esa solicitud por políticas de seguridad.";
        }

        // Error genérico para no romper el backend
        return "Ups, tuve un pequeño problema técnico. ¿Podrías repetirme la pregunta?";
    }
}

module.exports = { generateChatResponse };