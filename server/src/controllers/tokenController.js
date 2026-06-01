const UserModel = require('../models/UserModel');

// Authenticate a user and issue a token 
exports.createToken = (req, res) => {
    const { username, password } = req.body;

    // Validate that both credentials are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Verify credentials against the database
    const user = UserModel.findByCredentials(username, password);

    // Handle authentication failure
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return 200 with the authenticated user's ID
    res.status(200).json({ id: user.id });
};