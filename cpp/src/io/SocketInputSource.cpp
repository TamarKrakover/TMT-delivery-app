#include "SocketInputSource.hpp"
#include <unistd.h>
using namespace std;
// constructor: Initializes the input source with a client socket descriptor
SocketInputSource::SocketInputSource(int socket) : clientSocket(socket) {}

// updates the active client socket descriptor dynamically
void SocketInputSource::setSocket(int socket) {
    clientSocket = socket;
}

// reads from the socket byte-by-byte until a full line is captured
string SocketInputSource::readNextLine() {
    if (clientSocket == -1) return "CLIENT_DISCONNECTED";
    
    string result = "";
    char buffer;
    int bytesRead;
    bool readSomething = false;
    
    while ((bytesRead = read(clientSocket, &buffer, 1)) > 0) {
        readSomething = true;
        if (buffer == '\n') break;
        result += buffer;
    }
    
    // Differentiate between empty line (\n) and actual disconnection (EOF)
    if (bytesRead <= 0 && !readSomething) {
        return "CLIENT_DISCONNECTED";
    }
    
    if (!result.empty() && result.back() == '\r') {
        result.pop_back();
    }
    return result;
}