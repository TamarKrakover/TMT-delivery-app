const UserModel = require('../models/UserModel');

const authMiddleware = async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    
    // Check if header is present
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
        // Check if user exists in the database
        const user = await UserModel.findUserById(userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found or invalid session' });
        }

    // Attach userId and user object to the request for downstream controllers to use
    req.userId = userId;
    req.user = user;
    
    // Pass control to the next middleware or controller
    next();
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

module.exports = authMiddleware;
