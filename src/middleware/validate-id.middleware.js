const { Types } = require('mongoose');

const validateGlobalID = {

    id : (req, res, next) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            ok: false,
            type: 'ValidationError',
            message: 'The ID submitted is not a valid MongoDB ID.'
        });
    }

    next(); 
}
};

module.exports = validateGlobalID;