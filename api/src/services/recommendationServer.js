const net = require('net');

class RecommendationServer {
    constructor() {
        // set the host and port for the EX2 C++ recommendation server
        this.host = process.env.RECOMMENDATION_SERVER_HOST || 'localhost';
        this.port = process.env.RECOMMENDATION_SERVER_PORT || 5555;
        // Keep track of user IDs that have had their first interaction during this session
        this.initializedUsers = new Set();
    }

    // A helper method to create a TCP connection, send a command, and return the response
    _sendCommand(commandStr) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();  // create a new TCP socket

            // Set a 5-second timeout to prevent the connection from hanging indefinitely
            client.setTimeout(5000);

            // Connect to the server and send the command appended with a newline character
            client.connect(this.port, this.host, () => {
                client.write(commandStr + '\n');
            });

            // listen for the server's response, resolve the promise, and close the connection
            client.on('data', (data) => {
                resolve(data.toString().trim());
                client.destroy();
            });

            // handle any connection errors
            client.on('error', (err) => {
                reject(err);
            });

            // Handle timeout drops
            client.on('timeout', () => {
                client.destroy();
                reject(new Error('Socket timeout'));
            });
        });
    }

    // Helper to check if the C++ server responded with success
    _isSuccess(response) {
        return response.startsWith('201') || response.startsWith('204') || response.startsWith('200');
    }

    // Sends a post command to record user product interactions
    async post(userId, productIds) {
        const pids = Array.isArray(productIds) ? productIds : [productIds];
        if (pids.length === 0) return '';
        const command = `post ${userId} ${pids.join(' ')}`;
        return await this._sendCommand(command);
    }

    // Sends a patch command to add product interactions to an existing user profile
    async patch(userId, productIds) {
        const pids = Array.isArray(productIds) ? productIds : [productIds];
        if (pids.length === 0) return '';
        const command = `patch ${userId} ${pids.join(' ')}`;
        return await this._sendCommand(command);
    }

    // Sends a delete command to remove product interactions from a user profile
    async delete(userId, productIds) {
        const pids = Array.isArray(productIds) ? productIds : [productIds];
        if (pids.length === 0) return '';
        const command = `delete ${userId} ${pids.join(' ')}`;
        return await this._sendCommand(command);
    }

    // helper implementing state session logic: tries POST or PATCH depending on initialization,
    // with try-catch fallback.
    async save(userId, productIds) {
        const pids = Array.isArray(productIds) ? productIds : [productIds];
        if (pids.length === 0) return '';

        try {
            const alreadyInitialized = this.initializedUsers.has(userId);

            if (alreadyInitialized) {
                // If we think the user is already initialized, try PATCH first
                try {
                    const patchResponse = await this.patch(userId, pids);
                    if (this._isSuccess(patchResponse)) {
                        return patchResponse;
                    }
                } catch (err) {
                    // Do not attempt fallback if it was a connection/timeout error (since POST would also fail)
                    throw err;
                }

                // Fallback to POST (e.g. if C++ server restarted and lost state)
                const postResponse = await this.post(userId, pids);
                if (this._isSuccess(postResponse)) {
                    this.initializedUsers.add(userId);
                }
                return postResponse;
            } else {
                // If we think the user is new, try POST first
                try {
                    const postResponse = await this.post(userId, pids);
                    if (this._isSuccess(postResponse)) {
                        this.initializedUsers.add(userId);
                        return postResponse;
                    }
                } catch (err) {
                    // Do not attempt fallback if it was a connection/timeout error
                    throw err;
                }

                // Fallback to PATCH (e.g. if Node restarted but C++ server still has the user)
                const patchResponse = await this.patch(userId, pids);
                if (this._isSuccess(patchResponse)) {
                    this.initializedUsers.add(userId);
                }
                return patchResponse;
            }
        } catch (error) {
            // Silently catch error to avoid crashing the Express thread
        }
    }
}

module.exports = new RecommendationServer();