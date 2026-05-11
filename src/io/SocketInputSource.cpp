#include "SocketInputSource.hpp"
#include <unistd.h>

SocketInputSource::SocketInputSource(int socket) : clientSocket(socket) {}

void SocketInputSource::setSocket(int socket) {
    clientSocket = socket;
}

std::string SocketInputSource::readNextLine() {
    if (clientSocket == -1) return "";
    
    std::string result = "";
    char buffer;
    while (read(clientSocket, &buffer, 1) > 0) {
        if (buffer == '\n') break;
        result += buffer;
    }
    if (!result.empty() && result.back() == '\r') {
        result.pop_back();
    }
    return result;
}