#include "TcpServer.hpp"
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>

TcpServer::TcpServer(int port, App& appRef, std::shared_ptr<SocketInputSource> in, std::shared_ptr<SocketOutputWriter> out) 
    : port(port), serverSocket(-1), app(appRef), input(std::move(in)), output(std::move(out)) {}

TcpServer::~TcpServer() {
    if (serverSocket != -1) close(serverSocket);
}

void TcpServer::start() {
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) return;

    struct sockaddr_in serverAddr;
    memset(&serverAddr, 0, sizeof(serverAddr));
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) < 0) return;

    listen(serverSocket, 5);

    while (true) {
        int clientSocket = accept(serverSocket, nullptr, nullptr);
        if (clientSocket >= 0) {
            handleClient(clientSocket);
        }
    }
}

void TcpServer::handleClient(int clientSocket) {
    // הלקוח התחבר! נעדכן את הסוקט באובייקטים הקיימים
    input->setSocket(clientSocket);
    output->setSocket(clientSocket);

    // מריצים את הלוגיקה
    app.run(); 

    // מתנתקים ומאפסים
    close(clientSocket);
    input->setSocket(-1);
    output->setSocket(-1);
}