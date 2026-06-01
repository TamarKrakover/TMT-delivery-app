const UserModel = require('../models/UserModel');

exports.createUser = (req, res) =>{
    // Extract all expected fields from the request body
    const { username, password, name, phone, address } = req.body;

    // Validate that all required fields were provided
    if (!username || !password || !name || !phone || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the username is already taken
    const existingUser = UserModel.findByUsername(username);
    if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' }); 
    }

    // Create the new user via the Model
    const newUser = UserModel.create(req.body);

    // Set the Location header pointing to the newly created user
    const resourceLocation = '/api/users/' + newUser.id;

    // Return 201 Created, set the Location header, and end with no body
    res.status(201).location(resourceLocation).end();
};

exports.getUserById = (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    const user = UserModel.findUserById(userId);
    if (!user) {
        return res.status(401).json({ error: 'User not found or invalid session' });
    }

    // Ensure users can only retrieve their own profile details
    if (req.params.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized to view this profile' });
    }
    
    res.status(200).json(user);
};

