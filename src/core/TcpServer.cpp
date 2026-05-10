#include "TcpServer.hpp"
#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"
#include "App.hpp"
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <stdexcept>

// Constructor initializes the server state.
// Initializes server_socket to -1 to indicate that no socket is open yet.
TcpServer::TcpServer(int port) : server_port(port), server_socket(-1) {}

// Destructor ensures that system resources are released.
// Closes the server socket if it was successfully created.
TcpServer::~TcpServer() {
    if (server_socket != -1) {
        close(server_socket);
    }
}

// Main server loop setup and execution.
void TcpServer::start() {
    // Create the server socket.
    // AF_INET specifies the IPv4 protocol.
    // SOCK_STREAM -TCP
    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        throw std::runtime_error("Error creating socket");
    }

    // Configure the server address structure.
    struct sockaddr_in sin;
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;  // Listen on all available network interfaces.
    sin.sin_port = htons(server_port); // Convert the port number to network byte order.

    // Bind the socket to the specified port and address.
    if (bind(server_socket, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        throw std::runtime_error("Error binding socket");
    }

    // Start listening for incoming client connections.
    // The second parameter (5) defines the queue limit for incoming connections.
    if (listen(server_socket, 5) < 0) {
        throw std::runtime_error("Error listening to socket");
    }

    // Enter a loop to continuously accept new clients.
    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        
        // Accept blocks execution until a client connects.
        // It returns a new file descriptor (client_sock) for the specific client.
        int client_sock = accept(server_socket, (struct sockaddr *) &client_sin, &addr_len);

        if (client_sock < 0) {
            // If accepting fails, continue to the next iteration without crashing.
            continue; 
        }

        // Handle the connected client's requests.
        handleClient(client_sock);
    }
}

