const cloudinary = require('../config/cloudinary');
const fs = require('fs'); // Para eliminar archivos temporales si usas Multer

/**
 * Sube una imagen a Cloudinary
 * @param {string} filePath - Ruta temporal del archivo
 * @param {string} subFolder - 'projects', 'blogs', 'tutorials', etc.
 */

exports.uploadImage = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `expedinap-tech/${folder}`,
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    });
    
    // Opcional: Borrar el archivo de la carpeta temporal de tu server tras subirlo
    // if (fs.existsSync(filePath)) {
    //     fs.unlinkSync(filePath);
    //     console.log('Imagen temporal eliminada del servidor');
    // }

    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    console.error('Error en Cloudinary Service:', error);
    throw new Error('Error al subir la imagen a la nube');
  }
};

/**
 * Elimina una imagen de Cloudinary
 * @param {string} public_id - El ID público de la imagen
 */
exports.deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Error al eliminar en Cloudinary:', error);
  }
};