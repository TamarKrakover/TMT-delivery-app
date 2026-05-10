#include "SocketInputSource.hpp"
#include <sys/socket.h> // For recv function
#include <stdexcept>    // For std::runtime_error

SocketInputSource::SocketInputSource(int clientSocket) : socket(clientSocket) {}

std::string SocketInputSource::readNextLine() {
    std::string line = "";
    char ch = 0;
    ssize_t bytesRead = 0;

    // Read exactly one byte at a time to safely find the newline character
    while (true) {
        // The flags parameter is set to 0
        bytesRead = recv(socket, &ch, 1, 0);
        
        if (bytesRead > 0) {
            line += ch;
            // Stop reading if we reached the end of the line
            if (ch == '\n') {
                break;
            }
        } 
        else if (bytesRead == 0) {
            // Client has closed the connection
            if (line.empty()) {
                throw std::runtime_error("EOF");
            }
            break; // Return whatever is left if connection closed mid-line
        } 
        else {
            // An error occurred during reading (-1)
            throw std::runtime_error("Socket read error");
        }
    }
    
    return line;
}