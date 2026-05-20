#ifndef TCP_SERVER_HPP
#define TCP_SERVER_HPP

#include "App.hpp"
#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"
#include <memory>
using namespace std;
// manages the TCP server lifecycle and dispatches client connections
class TcpServer {
private:
    int port;                                            // port number the server listens on                            
    int serverSocket;                                   // file descriptor for the main listening socket
    App& app;                                           // reference to the core application logic
    shared_ptr<SocketInputSource> input;          // shared abstraction for reading socket data  
    shared_ptr<SocketOutputWriter> output;        // shared abstraction for writing socket data 

public:
    // constructor: Initializes server configuration and binds I/O dependencies
    TcpServer(int port, App& appRef, shared_ptr<SocketInputSource> in, shared_ptr<SocketOutputWriter> out);
    // destructor: Safely closes the server socket and releases resources
    ~TcpServer();
    
    // binds the socket, starts listening, and enters the client acceptance loop
    void start();
    // assigns the connected client socket to I/O streams and runs the app logic
    void handleClient(int clientSocket);
};
#endif