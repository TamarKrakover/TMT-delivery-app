const UserModel = require('../models/UserModel');

exports.createUser = (req, res) =>{
    // Extract all expected fields from the request body
    const { username, password, name, phone, address } = req.body;

    // Validate that all required fields were provided
    if (!username || !password || !name || !phone || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create the new user via the Model
        const newUser = UserModel.create(req.body);

        // Set the Location header pointing to the newly created user
        const resourceLocation = '/api/users/' + newUser.id;

        // Return 201 Created, set the Location header, and end with no body
        res.status(201).location(resourceLocation).end();
    } catch (error) {
        if (error.message === 'Username already exists') {
            return res.status(409).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserById = (req, res) => {
    const userId = req.userId;
    const user = req.user;

    // Ensure users can only retrieve their own profile details
    if (req.params.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized to view this profile' });
    }

    res.status(200).json(user);
};

