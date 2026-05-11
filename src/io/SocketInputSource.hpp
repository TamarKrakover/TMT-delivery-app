#ifndef SOCKET_INPUT_SOURCE_HPP
#define SOCKET_INPUT_SOURCE_HPP

#include "IInputSource.hpp"
#include <string>

class SocketInputSource : public IInputSource {
private:
    int clientSocket;
public:
    explicit SocketInputSource(int socket = -1);
    ~SocketInputSource() override = default;
    
    void setSocket(int socket);
    std::string readNextLine() override;
};
#endif