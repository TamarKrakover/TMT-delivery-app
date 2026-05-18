#ifndef SOCKET_OUTPUT_WRITER_HPP
#define SOCKET_OUTPUT_WRITER_HPP

#include "IOutputWriter.hpp"
#include <string>

// concrete implementation of IOutputWriter for sending data over network sockets
class SocketOutputWriter : public IOutputWriter {
private:
    // file descriptor for the connected client socket
    int clientSocket;
public:
    // constructor: Initializes with an optional socket descriptor
    explicit SocketOutputWriter(int socket = -1);
    // virtual destructor
    ~SocketOutputWriter() override = default;
    // dynamically updates the active client socket descriptor
    void setSocket(int socket);
    // sends a message through the socket
    void write(const std::string& message) override;
};
#endif