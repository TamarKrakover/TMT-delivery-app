const net = require('net');

class RecommendationServiceClient {
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

    // Sends a stateful command to notify the recommendation server about a product view
    async notifyProductView(userId, productId) {
        try {
            const alreadyInitialized = this.initializedUsers.has(userId);

            if (alreadyInitialized) {
                // If we think the user is already initialized, try PATCH first
                const patchCommand = `patch ${userId} ${productId}`;
                try {
                    const patchResponse = await this._sendCommand(patchCommand);
                    if (this._isSuccess(patchResponse)) {
                        return patchResponse;
                    }
                } catch (err) {
                    // Do not attempt fallback if it was a connection/timeout error (since POST would also fail)
                    throw err;
                }

                // Fallback to POST (e.g. if C++ server restarted and lost state)
                const postCommand = `post ${userId} ${productId}`;
                const postResponse = await this._sendCommand(postCommand);
                if (this._isSuccess(postResponse)) {
                    this.initializedUsers.add(userId);
                }
                return postResponse;
            } else {
                // If we think the user is new, try POST first
                const postCommand = `post ${userId} ${productId}`;
                try {
                    const postResponse = await this._sendCommand(postCommand);
                    if (this._isSuccess(postResponse)) {
                        this.initializedUsers.add(userId);
                        return postResponse;
                    }
                } catch (err) {
                    // Do not attempt fallback if it was a connection/timeout error
                    throw err;
                }

                // Fallback to PATCH (e.g. if Node restarted but C++ server still has the user)
                const patchCommand = `patch ${userId} ${productId}`;
                const patchResponse = await this._sendCommand(patchCommand);
                if (this._isSuccess(patchResponse)) {
                    this.initializedUsers.add(userId);
                }
                return patchResponse;
            }
        } catch (error) {
            // Silently catch error to avoid crashing the Express thread
        }
    }

    // sends a post command to notify the recommendation server about a product order
    async notifyProductOrder(userId, productId) {
        try {
            const command = `post ${userId} ${productId}`;
            const response = await this._sendCommand(command);
            return response;
        } catch (error) {
            // Silently catch error to avoid crashing the Express thread
        }
    }

    // TODO: add a feature that will GET from cpp server the recommendation. 
    // it will have to check if a recommended pruduct is exists and not deleted. 

}

module.exports = new RecommendationServiceClient();