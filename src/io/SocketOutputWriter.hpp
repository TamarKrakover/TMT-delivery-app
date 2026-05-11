#ifndef SOCKET_OUTPUT_WRITER_HPP
#define SOCKET_OUTPUT_WRITER_HPP

#include "IOutputWriter.hpp"
#include <string>

class SocketOutputWriter : public IOutputWriter {
private:
    int clientSocket;
public:
    explicit SocketOutputWriter(int socket = -1);
    ~SocketOutputWriter() override = default;
    
    void setSocket(int socket);
    void write(const std::string& message) override;
};
#endif