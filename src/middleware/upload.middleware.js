const multer = require('multer');
const path = require('path');

// 1. Definimos dónde se guarda temporalmente y con qué nombre
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Apuntamos a la carpeta 'uploads' que tienes a nivel de raíz/src
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        // Creamos un nombre único: timestamp + nombre original limpio
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 2. Filtro de archivos para que solo acepte imágenes (Velocidad y Seguridad)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo no es una imagen válida'), false);
    }
};

// 3. Exportamos el middleware configurado
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Límite de 5MB por imagen
    }
});

module.exports = upload;