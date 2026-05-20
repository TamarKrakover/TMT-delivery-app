#include "TcpServer.hpp"
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>
using namespace std;
// constructor: Initializes server configuration and moves I/O dependencies
TcpServer::TcpServer(int port, App& appRef, shared_ptr<SocketInputSource> in, shared_ptr<SocketOutputWriter> out) 
    : port(port), serverSocket(-1), app(appRef), input(move(in)), output(move(out)) {}

// destructor: Ensures the server socket is safely closed upon destruction
TcpServer::~TcpServer() {
    if (serverSocket != -1) close(serverSocket);
}

// starts the TCP server and enters the listening loop
void TcpServer::start() {
    // create an IPv4 TCP socket
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) return;

    // configure server address structure
    struct sockaddr_in serverAddr;
    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    // allow instant port reuse to avoid "Address already in use" errors on restart
    int opt = 1;
    setsockopt(serverSocket, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    // bind socket to the specified port
    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) return;

    // start listening for incoming connections with a backlog queue of 5
    listen(serverSocket, 5);

    // accept incoming client connections sequentially
    while (true) {
        int clientSocket = accept(serverSocket, nullptr, nullptr);
        if (clientSocket >= 0) {
            handleClient(clientSocket);
        }
    }
}

// handles interaction with a connected client
void TcpServer::handleClient(int clientSocket) {
    // inject the active client socket into the shared I/O handlers
    input->setSocket(clientSocket);
    output->setSocket(clientSocket);

    // execute the core application logic for this client
    app.run(); 

    // cleanup: Disconnect client and reset I/O handlers to an invalid state
    close(clientSocket);
    input->setSocket(-1);
    output->setSocket(-1);
}