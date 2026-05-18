#ifndef SOCKET_INPUT_SOURCE_HPP
#define SOCKET_INPUT_SOURCE_HPP

#include "IInputSource.hpp"
#include <string>

// concrete implementation of IInputSource for reading from network sockets
class SocketInputSource : public IInputSource {
private:
    // file descriptor for the connected client socket
    int clientSocket;
public:
    // constructor: Initializes with an optional socket descriptor
    explicit SocketInputSource(int socket = -1);
    // virtual destructor
    ~SocketInputSource() override = default;
    // dynamically updates the active client socket descriptor
    void setSocket(int socket);
    // reads a single line from the socket
    std::string readNextLine() override;
};
#endif