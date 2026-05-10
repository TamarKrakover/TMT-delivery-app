#ifndef TCP_SERVER_HPP
#define TCP_SERVER_HPP

#include "../repositories/FileDataRepository.hpp"
#include "Recommender.hpp"

class TcpServer {
public:
    // Constructor requires shared dependencies to inject into specific client sessions
    TcpServer(int port, FileDataRepository& repo, Recommender& recommender);
    
    // Destructor ensures the main server socket is closed gracefully
    ~TcpServer();
    
    // Starts the infinite loop to listen for and accept new client connections
    void start();
    
    // Handles the complete lifecycle of a single connected client
    void handleClient(int client_socket);

private:
    int server_port;
    int server_socket;
    
    // Shared references for all clients to avoid duplicating heavy data in memory
    FileDataRepository& m_repo;
    Recommender& m_recommender;
};

#endif