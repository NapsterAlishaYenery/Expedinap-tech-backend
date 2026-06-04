const User = require('../models/user-expedinap-tech');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadImage, deleteImage } = require('../services/cloudinary.service');
const deleteLocalFiles = require('../utils/fileCleanup.util');

exports.signUp = async (req, res) => {
    try {
        const { name, lastname, username, email, password, address } = req.body;

        const userExists = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
        });

        if (userExists) {
            return res.status(400).json({
                ok: false,
                data: null,
                type: 'UserExistsError',
                message: "Email or Username is already registered"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            name,
            lastname,
            username,
            email,
            password: hashedPassword, 
            address
        });

        if (req.file) {
            const avatarResult = await uploadImage(req.file.path, 'users/avatars');
            newUser.avatar = {
                public_id: avatarResult.public_id,
                url: avatarResult.url,
                alt: `Avatar of ${username}`
            };
        }

        await newUser.save();

        res.status(201).json({
            ok: true,
            data: newUser,
            message: "User registered successfully in ExpediNap Tech"
        });

    } catch (error) {
        console.error('--- SIGNUP ERROR ---', error);
        res.status(500).json({
            ok: false,
            data: null,
            type: 'ServerError',
            message: "Internal Server Error during registration"
        });

    } finally {
        if (req.file) await deleteLocalFiles(req.file);
    }
};

exports.login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { username: identifier.toLowerCase() },
                { email: identifier.toLowerCase() }
            ]
        }).select('+password'); 

        if (!user || !user.active) {
            return res.status(401).json({
                ok: false,
                type: 'AuthError',
                data: null, 
                message: 'Invalid credentials or account disabled',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                ok: false,
                type: 'AuthError',
                data: null, 
                message: 'Invalid credentials',
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            ok: true,
            data: {
                token,
                user 
            },
            message: 'Welcome back to ExpediNap Tech'
        });

    } catch (error) {
        console.error('--- LOGIN ERROR ---', error);
        res.status(500).json({
            ok: false,
            type: 'ServerError',
            data: null, 
            message: 'Internal server error during login'
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.user.id;
        const updateData = req.body;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                ok: false,
                data: null,
                type: 'NotFoundError',
                message: "User not found"
            });
        }

        if (req.file) {
            if (user.avatar && user.avatar.public_id) {
                await deleteImage(user.avatar.public_id);
            }
            const avatarResult = await uploadImage(req.file.path, 'users/avatars');
            updateData.avatar = {
                public_id: avatarResult.public_id,
                url: avatarResult.url,
                alt: `Avatar of ${user.username}`
            };
        }

       
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            ok: true,
            data: updatedUser,
            message: "Your profile was updated successfully"
        });

    } catch (error) {
        console.error('--- UPDATE PROFILE ERROR ---', error);
        res.status(500).json({
            ok: false,
            data: null,
            type: 'ServerError',
            message: "Error updating your profile"
        });
        
    } finally {
        if (req.file) await deleteLocalFiles(req.file);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            ok: true,
            data: user,
            message: "Profile retrieved"
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error retrieving profile" });
    }
};

exports.deleteUserById = async(req, res) => {
    //pendiente
};