#ifndef TCP_SERVER_HPP
#define TCP_SERVER_HPP

#include "App.hpp"
#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"
#include <memory>

class TcpServer {
private:
    int port;
    int serverSocket;
    App& app;
    std::shared_ptr<SocketInputSource> input;
    std::shared_ptr<SocketOutputWriter> output;

public:
    // השרת מקבל גם את מקורות ה-I/O כדי לעדכן אותם
    TcpServer(int port, App& appRef, std::shared_ptr<SocketInputSource> in, std::shared_ptr<SocketOutputWriter> out);
    ~TcpServer();
    
    void start();
    void handleClient(int clientSocket);
};
#endif