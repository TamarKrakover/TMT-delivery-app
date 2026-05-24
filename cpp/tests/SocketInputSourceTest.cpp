#include <gtest/gtest.h>
#include "SocketInputSource.hpp"
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include <string>
using namespace std;
TEST(SocketInputSourceTest, ReadsDataOverInet) {
    // Setup server socket
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in server_sin;
    server_sin.sin_family = AF_INET;
    server_sin.sin_addr.s_addr = INADDR_ANY;
    server_sin.sin_port = 0; 

    bind(server_fd, (struct sockaddr*)&server_sin, sizeof(server_sin));
    listen(server_fd, 1);

    socklen_t len = sizeof(server_sin);
    getsockname(server_fd, (struct sockaddr*)&server_sin, &len);
    int port = ntohs(server_sin.sin_port);

    // 2. Client connects
    int client_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in client_sin;
    client_sin.sin_family = AF_INET;
    client_sin.sin_addr.s_addr = inet_addr("127.0.0.1");
    client_sin.sin_port = htons(port);

    int accepted_sock;
    thread server_thread([&]() {
        struct sockaddr_in from;
        unsigned int from_len = sizeof(from);
        accepted_sock = accept(server_fd, (struct sockaddr*)&from, &from_len);
    });

    connect(client_fd, (struct sockaddr*)&client_sin, sizeof(client_sin));
    server_thread.join();

    // 3. Client sends a message directly using send()
    string test_msg = "test command\n";
    send(client_fd, test_msg.c_str(), test_msg.length(), 0);

    // 4. Verification: SocketInputSource reads the message
    SocketInputSource inputSource(accepted_sock);
    string result = inputSource.readNextLine();

    // The implementation of readNextLine strips the newline character
    EXPECT_EQ(result, "test command");

    // Cleanup
    close(accepted_sock);
    close(client_fd);
    close(server_fd);
}