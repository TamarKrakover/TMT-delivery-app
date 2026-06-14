const db = require('./InMemoryDB');

// Generate a unique user ID using a timestamp and a random number
const generateUserId = () => {
    return 'u_' + Date.now().toString() + '_' + Math.floor(Math.random() * 1000);
};

class UserModel {

    // Create a new user
    static create(data) {
        // Check if the username is already taken
        if (this.findByUsername(data.username)) {
            throw new Error('Username already exists');
        }

        const newUser = {
            id: generateUserId(),
            username: data.username,
            password: data.password,
            name: data.name,
            role: data.role || 'customer',
            phone: data.phone,
            address: data.address
        };
        db.users.push(newUser);
        return newUser;
    }

    // Retrieve a user by their exact username
    static findByUsername(username) {
        return db.users.find(u => u.username === username);
    }
    
    // Find a user by ID
    static findUserById(id) {
        return db.users.find(u => u.id === id);
    }

    // Find a user by both username and password
    static findByCredentials(username, password) {
        return db.users.find(u => u.username === username && u.password === password);
    }
}

module.exports = UserModel;