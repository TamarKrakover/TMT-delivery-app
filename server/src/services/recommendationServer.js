const net = require('net');

class RecommendationClient {
    constructor() {
        // set the host and port for the EX2 C++ recommendation server
        this.host = process.env.RECOMMENDATION_SERVER_HOST || 'localhost';
        this.port = process.env.RECOMMENDATION_SERVER_PORT || 5555;
        }

        // a helper method to create a TCP connection, send a command, and return the response
        _sendCommand(commandStr) {
            return new Promise((resolve, reject) => {
                const client = new net.Socket();  // create a new TCP socket

                // connect to the server and send the command appended with a newline character
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
                    console.error('TCP Socket Error to Recommendation Server:', err.message);
                reject(err);
            });
        });
    }

    // sends a patch command to notify the recommendation server about a product view
    async notifyProductView(userId, productId) {
        try {
            const command = `patch ${userId} ${productId}`; 
            const response = await this._sendCommand(command);
            console.log(`[Recommendation Server] Response for view: ${response}`);
            return response;
        } catch (error) {
            console.error(`Failed to notify product view for user ${userId} on product ${productId}`);
        }
    }

    // sends a post command to notify the recommendation server about a product order
    async notifyProductOrder(userId, productId) {
        try {
            const command = `post ${userId} ${productId}`;
            const response = await this._sendCommand(command);
            console.log(`[Recommendation Server] Response for order: ${response}`);
            return response;
        } catch (error) {
            console.error(`Failed to notify product order for user ${userId} on product ${productId}`);
        }
    }
}

module.exports = new RecommendationClient();