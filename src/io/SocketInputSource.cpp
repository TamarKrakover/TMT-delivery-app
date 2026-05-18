#include "SocketInputSource.hpp"
#include <unistd.h>

// constructor: Initializes the input source with a client socket descriptor
SocketInputSource::SocketInputSource(int socket) : clientSocket(socket) {}

// updates the active client socket descriptor dynamically
void SocketInputSource::setSocket(int socket) {
    clientSocket = socket;
}

// reads from the socket byte-by-byte until a full line is captured
std::string SocketInputSource::readNextLine() {
    // return an empty string immediately if the socket is invalid
    if (clientSocket == -1) return "";
    
    std::string result = "";
    char buffer;
    // read character by character until newline (\n) or EOF is reached
    while (read(clientSocket, &buffer, 1) > 0) {
        if (buffer == '\n') break;
        result += buffer;
    }
    // remove '\r' from the end of the line if it exists
    if (!result.empty() && result.back() == '\r') {
        result.pop_back();
    }
    return result;
}