#include "SocketOutputWriter.hpp"
#include <sys/socket.h> 
#include <string>

SocketOutputWriter::SocketOutputWriter(int clientSocket) : socket(clientSocket) {}

void SocketOutputWriter::write(const std::string& message) {
    // Convert C++ string to a character array (const char*) for network transmission
    const char* data = message.c_str();
    int data_len = message.length();
    
    // Send the data through the socket, similar to the lab exercise 4_tcp_s.cpp
    // The flags parameter is set to 0
    int sent_bytes = send(socket, data, data_len, 0);
    
    if (sent_bytes < 0) {
        // Error handling can be added here if needed, such as throwing an exception
        // perror("error sending to client");
    }
}