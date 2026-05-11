#include <gtest/gtest.h>
#include "SocketOutputWriter.hpp"
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include <string>

TEST(SocketOutputWriterTest, SendsDataOverInet) {
    // Setup a dummy server socket to accept a connection
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in server_sin;
    server_sin.sin_family = AF_INET;
    server_sin.sin_addr.s_addr = INADDR_ANY;
    server_sin.sin_port = 0; // Let the OS choose an available port

    bind(server_fd, (struct sockaddr*)&server_sin, sizeof(server_sin));
    listen(server_fd, 1);

    // Get the port number assigned by the OS
    socklen_t len = sizeof(server_sin);
    getsockname(server_fd, (struct sockaddr*)&server_sin, &len);
    int port = ntohs(server_sin.sin_port);

    // Connect a client socket to this server in a separate thread or non-blocking way
    int client_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in client_sin;
    client_sin.sin_family = AF_INET;
    client_sin.sin_addr.s_addr = inet_addr("127.0.0.1");
    client_sin.sin_port = htons(port);

    // Create a thread to accept the connection on the server side
    int accepted_sock;
    std::thread server_thread([&]() {
        struct sockaddr_in from;
        unsigned int from_len = sizeof(from);
        accepted_sock = accept(server_fd, (struct sockaddr*)&from, &from_len);
    });

    connect(client_fd, (struct sockaddr*)&client_sin, sizeof(client_sin));
    server_thread.join();

    // Use SocketOutputWriter on the accepted socket (server side)
    SocketOutputWriter writer(accepted_sock);
    std::string test_msg = "test_inet_message";
    writer.write(test_msg);

    // Verify the client received the correct data
    char buffer[1024] = {0};
    int bytes_received = recv(client_fd, buffer, sizeof(buffer), 0);

    EXPECT_EQ(std::string(buffer, bytes_received), test_msg);

    // Cleanup
    close(accepted_sock);
    close(client_fd);
    close(server_fd);
}