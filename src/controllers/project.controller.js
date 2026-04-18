const Project = require('../models/proyects-expedinap-tech');
const { uploadImage, deleteImage } = require('../services/cloudinary.service');
const deleteLocalFiles = require('../utils/fileCleanup.util');

exports.createProject = async (req, res) => {
    try {
        // 1. Extraer textos (ya validados por JOI)
        const projectData = req.body;

        // 2. Manejo de Imágenes
        if (!req.files || !req.files.mainImage) {
            return res.status(400).json({
                ok: false,
                type: 'BadRequest',
                message: 'Main image is required'
            });
        }

        // --- CAMBIO AQUÍ: Subir Imagen Principal ---
        // Usamos mainImageResult.url porque así lo definiste en el servicio de Cloudinary
        const mainImageResult = await uploadImage(req.files.mainImage[0].path, 'projects/main');

        projectData.mainImage = {
            public_id: mainImageResult.public_id,
            url: mainImageResult.url, // ANTES: secure_url (Esto causaba el error de validación)
            alt: projectData.title
        };

        // --- CAMBIO AQUÍ: Subir Galería ---
        if (req.files.gallery && req.files.gallery.length > 0) {
            const galleryPromises = req.files.gallery.map(file =>
                uploadImage(file.path, 'projects/gallery')
            );
            const galleryResults = await Promise.all(galleryPromises);

            projectData.gallery = galleryResults.map(img => ({
                public_id: img.public_id,
                url: img.url, // ANTES: secure_url (Cambiado para coincidir con el Schema)
                alt: `Gallery image for ${projectData.title}`
            }));
        }

        // 3. Crear en la base de datos
        // Ahora Mongoose dejará pasar el documento porque los campos 'url' ya tienen datos
        const newProject = await Project.create(projectData);

        res.status(201).json({
            ok: true,
            data: newProject,
            message: 'Project created successfully in ExpediNap Tech'
        });

    } catch (error) {
        console.error('--- CREATE PROJECT ERROR ---', error);

        if (error.code === 11000) {
            return res.status(400).json({
                ok: false,
                type: 'DuplicateError',
                message: 'A project with this slug already exists.'
            });
        }

        res.status(500).json({
            ok: false,
            type: 'ServerError',
            message: 'Internal Server Error',
        });
    } finally {
        // Borra todo lo que Multer atrapó en mainImage y gallery de un solo golpe
        if (req.files) await deleteLocalFiles(req.files);
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const { category, stack, featured } = req.query;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = parseInt(req.query.limit) || 12;
        // calculomatematico para desplazamiento
        const skip = (page - 1) * limit;

        // Filtro Dinámico
        let query = { 'status.isVisible': true };
        if (category) query.category = category;
        if (stack) query.stacks = { $in: [stack.toLowerCase()] };
        if (featured) query['status.isFeatured'] = featured === 'true';

        const [allProjects, total] = await Promise.all([
            Project.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Project.countDocuments(query)
        ]);

        /**
         * 3. LÓGICA DE METADATOS (Cálculos para el Frontend)
         * Estos datos ayudan a Angular a saber si debe mostrar el botón "Siguiente" o "Anterior".
         */
        const totalPages = Math.ceil(total / limit); // Redondea hacia arriba (ej: 1.1 páginas = 2 páginas)
        const hasNextPage = page < totalPages;            // ¿Hay una página después de esta?
        const hasPrevPage = page > 1;                    // ¿Hay una página antes de esta?

        // si no encuentra ningun project con esos criterios de busquedas
        if (total === 0) {
            return res.status(200).json({
                ok: true,
                data: [],
                message: "No projects were found that met those criteria.",
                pagination: { page, limit, totalItems: 0, totalPages: 0, hasNextPage, hasPrevPage }
            });
        }

        res.status(200).json({
            ok: true,
            data: allProjects,
            message: "All your current projects",
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: totalPages,
                hasNextPage,  // Booleano para el botón "Next"
                hasPrevPage   // Booleano para el botón "Prev"
            }
        });
    } catch (error) {
        console.error('--- GET ALL PROJECT ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            data: null,
            message: 'Error retrieving projects'
        });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        // 1. Verificar si el proyecto existe antes de hacer nada
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({
                ok: false,
                data: null,
                type: 'NotFoundError',
                message: "Project not found"
            });
        }

        // 2. ACTUALIZAR IMAGEN PRINCIPAL (Main Image)
        if (req.files && req.files.mainImage) {
            // Borramos la vieja de Cloudinary
            if (project.mainImage && project.mainImage.public_id) {
                await deleteImage(project.mainImage.public_id);
            }
            // Subimos la nueva
            const mainResult = await uploadImage(req.files.mainImage[0].path, 'projects/main');
            updateData.mainImage = {
                public_id: mainResult.public_id,
                url: mainResult.url,
                alt: updateData.title || project.title
            };
        }

        // 3. ACTUALIZAR GALERÍA (Reemplazo Total)
        if (req.files && req.files.gallery && req.files.gallery.length > 0) {
            // A. Borramos TODA la galería vieja de Cloudinary
            if (project.gallery && project.gallery.length > 0) {
                const deletePromises = project.gallery.map(img => deleteImage(img.public_id));
                await Promise.all(deletePromises);
            }
            // B. Subimos la nueva galería
            const galleryPromises = req.files.gallery.map(file =>
                uploadImage(file.path, 'projects/gallery')
            );
            const galleryResults = await Promise.all(galleryPromises);

            updateData.gallery = galleryResults.map(img => ({
                public_id: img.public_id,
                url: img.url,
                alt: `Gallery image for ${updateData.title || project.title}`
            }));
        }

        // 4. MANEJO DE OBJETOS ANIDADOS (Status y Links)
        // Como es un PATCH, queremos combinar lo que viene con lo que ya hay
        if (updateData.status) {
            updateData.status = { ...project.status, ...updateData.status };
        }
        if (updateData.links) {
            updateData.links = { ...project.links, ...updateData.links };
        }

        // 5. ACTUALIZAR EN BASE DE DATOS
        // runValidators asegura que cumpla el ENUM de categorías y los tipos
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            ok: true,
            data: updatedProject,
            message: "Project updated successfully in ExpediNap Tech"
        });

    } catch (error) {
        console.error('--- UPDATE PROJECT ERROR ---', error);
        res.status(500).json({
            ok: false,
            data: null,
            type: 'ServerError',
            message: "Internal Server Error during update",
        });

    } finally {
        // NO IMPORTA SI HUBO ERROR O ÉXITO, LIMPÌAMOS
        if (req.file) await deleteLocalFiles(req.file);
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscar el proyecto para obtener los public_id de las imágenes
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                ok: false,
                data: null,
                type: 'NotFoundError',
                message: "Project not found. Nothing to delete."
            });
        }

        // 2. ELIMINAR IMÁGENES DE CLOUDINARY
        // Creamos un array para recolectar todas las promesas de borrado
        const deletionPromises = [];

        // Agregar imagen principal si existe
        if (project.mainImage && project.mainImage.public_id) {
            deletionPromises.push(deleteImage(project.mainImage.public_id));
        }

        // Agregar todas las imágenes de la galería si existen
        if (project.gallery && project.gallery.length > 0) {
            project.gallery.forEach(img => {
                if (img.public_id) {
                    deletionPromises.push(deleteImage(img.public_id));
                }
            });
        }

        // Ejecutamos todos los borrados en Cloudinary en paralelo
        if (deletionPromises.length > 0) {
            await Promise.all(deletionPromises);
        }

        // 3. ELIMINAR DE LA BASE DE DATOS
        await Project.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            data: { id },
            message: "Project and all associated images deleted successfully from ExpediNap Tech"
        });

    } catch (error) {
        console.error('--- DELETE PROJECT ERROR ---', error);
        res.status(500).json({
            ok: false,
            data: null,
            type: 'ServerError',
            message: "Internal Server Error during project deletion"
        });
    }
};

exports.getBySlugProject = async (req, res) => {
    try {
        const { slug } = req.params;

        // Buscamos un proyecto que coincida con el slug y que esté visible
        const project = await Project.findOne({
            slug: slug.toLowerCase(),
            'status.isVisible': true
        });

        if (!project) {
            return res.status(404).json({
                ok: false,
                data: null,
                type: 'NotFoundError',
                message: "Project not found or is currently hidden"
            });
        }

        res.status(200).json({
            ok: true,
            data: project,
            message: "Project details retrieved successfully"
        });

    } catch (error) {
        console.error('--- GET BY SLUG ERROR ---', error);
        res.status(500).json({
            ok: false,
            data: null,
            type: 'ServerError',
            message: "Internal Server Error retrieving project details"
        });
    }
};