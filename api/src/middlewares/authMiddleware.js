const UserModel = require('../models/UserModel');

const authMiddleware = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    
    // Check if header is present
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if user exists in the mock database
    const user = UserModel.findUserById(userId);
    if (!user) {
        return res.status(401).json({ error: 'User not found or invalid session' });
    }

    // Attach userId and user object to the request for downstream controllers to use
    req.userId = userId;
    req.user = user;
    
    // Pass control to the next middleware or controller
    next();
};

module.exports = authMiddleware;
