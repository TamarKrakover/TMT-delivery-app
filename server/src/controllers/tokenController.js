const UserModel = require('../models/userModel');

exports.createToken = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = UserModel.findByCredentials(username, password);

    if (!user) {
        return res.status(404).json({ error: 'Invalid username or password' });
        // TODO: check if 401 is better
    }
    
    res.status(200).json({ id: user.id });
};