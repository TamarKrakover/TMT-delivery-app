#include "SocketOutputWriter.hpp"
#include <sys/socket.h>

// constructor: Initializes the output writer with a client socket descriptor
SocketOutputWriter::SocketOutputWriter(int socket) : clientSocket(socket) {}

// updates the active client socket descriptor dynamically
void SocketOutputWriter::setSocket(int socket) {
    clientSocket = socket;
}

// appends a newline and sends the message over the network socket
void SocketOutputWriter::write(const std::string& message) {
    // only attempt to send if the socket is valid
    if (clientSocket != -1) {
        std::string toSend = message + "\n";
        send(clientSocket, toSend.c_str(), toSend.size(), 0);
    }
}