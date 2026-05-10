#ifndef SOCKET_OUTPUT_WRITER_HPP
#define SOCKET_OUTPUT_WRITER_HPP

#include "IOutputWriter.hpp"
#include <string>
#include <sys/socket.h> //send()
#include <netinet/in.h> // sockaddr_in 
#include <arpa/inet.h>  // IP address conversion 

class SocketOutputWriter : public IOutputWriter {
public:
    /**
     * Constructor receives an active client socket file descriptor.
     * @param clientSocket The socket through which data will be sent.
     */
    explicit SocketOutputWriter(int clientSocket);
    
    /**
     * Implementation of the IOutputWriter interface.
     * Sends the string message to the client via the socket.
     */
    void write(const std::string& message) override;

private:
    int socket; // The file descriptor for the client connection
};

#endif