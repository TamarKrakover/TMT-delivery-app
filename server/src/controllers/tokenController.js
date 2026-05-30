const UserModel = require('../models/UserModel');

exports.createToken = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = UserModel.findByCredentials(username, password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
        // TODO: check 401 status (or 404)
    }

    res.status(200).json({ id: user.id });
};