#include "SocketOutputWriter.hpp"
#include <sys/socket.h>

SocketOutputWriter::SocketOutputWriter(int socket) : clientSocket(socket) {}

void SocketOutputWriter::setSocket(int socket) {
    clientSocket = socket;
}

void SocketOutputWriter::write(const std::string& message) {
    if (clientSocket != -1) {
        std::string toSend = message + "\n";
        send(clientSocket, toSend.c_str(), toSend.size(), 0);
    }
}