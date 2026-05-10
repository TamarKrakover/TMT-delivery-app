#include "TcpServer.hpp"
#include "../io/SocketInputSource.hpp"
#include "../io/SocketOutputWriter.hpp"
#include "App.hpp"
#include "../commands/AddCommand.hpp"
#include "../commands/RecommendCommand.hpp"
#include "../commands/HelpCommand.hpp"

#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <stdexcept>
#include <map>
#include <memory>
#include <string>

// Constructor: Initializes the server state and stores references to shared dependencies
TcpServer::TcpServer(int port, FileDataRepository& repo, Recommender& recommender) 
    : server_port(port), server_socket(-1), m_repo(repo), m_recommender(recommender) {}

// Destructor: Closes the server socket if it was successfully opened
TcpServer::~TcpServer() {
    if (server_socket != -1) {
        close(server_socket);
    }
}

// Main execution loop for the TCP Server
void TcpServer::start() {
    // Create the server socket for IPv4 and TCP
    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        throw std::runtime_error("Error creating socket");
    }

    // Configure the server address and port
    struct sockaddr_in sin;
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;  // Listen on all available network interfaces
    sin.sin_port = htons(server_port); // Convert port to network byte order

    // Bind the socket to the configured address
    if (bind(server_socket, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        throw std::runtime_error("Error binding socket");
    }

    // Start listening for incoming connections queue size of 5
    if (listen(server_socket, 5) < 0) {
        throw std::runtime_error("Error listening to socket");
    }

    // loop to accept and handle clients sequentially
    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        
        // Block and wait for a new client connection
        int client_sock = accept(server_socket, (struct sockaddr *) &client_sin, &addr_len);

        // If connection fails, skip and wait for the next one without crashing the server
        if (client_sock < 0) {
            continue; 
        }

        // Delegate the specific client handling to a dedicated method
        handleClient(client_sock);
    }
}

// Manages the IO and Application logic for a single client
void TcpServer::handleClient(int client_socket) {
    // Create IO adapters specifically for this client's socket
    auto input = std::make_shared<SocketInputSource>(client_socket);
    auto output = std::make_shared<SocketOutputWriter>(client_socket);
    
    // Initialize a command map tailored for this specific client
    std::map<std::string, std::shared_ptr<ICommand>> commands;
    
    // Inject shared dependencies (repo, recommender) and client-specific dependencies (output)
    commands["add"] = std::make_shared<AddCommand>(m_repo);
    commands["recommend"] = std::make_shared<RecommendCommand>(m_recommender, *output);
    commands["help"] = std::make_shared<HelpCommand>(*output);

    try {
        // Instantiate the App with the client's context and execute its main loop
        App app(input, output, std::move(commands)); 
        app.run();
    } 
    catch (const std::runtime_error& e) {
        // Handle EOF gracefully when the client disconnects and close the specific socket
        close(client_socket);
    }
}