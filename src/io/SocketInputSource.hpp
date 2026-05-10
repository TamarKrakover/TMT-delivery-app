#ifndef SOCKET_INPUT_SOURCE_HPP
#define SOCKET_INPUT_SOURCE_HPP

#include "IInputSource.hpp"
#include <string>
#include <sys/socket.h>

class SocketInputSource : public IInputSource {
public:
    // Receives the connected client socket
    explicit SocketInputSource(int clientSocket);
    
    // Reads data from the socket
    std::string readNextLine() override;

private:
    int socket;
};

#endif