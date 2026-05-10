#include <gtest/gtest.h>
#include "TcpServer.hpp"
#include <sys/socket.h>
#include <unistd.h>
#include <string>

TEST(TcpServerTest, HandlesClientAndExitsGracefullyOnEOF) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);

    // Client writes commands into its end of the socket pair
    std::string commands = "help\nadd 1 200 300\n";
    send(sv[0], commands.c_str(), commands.length(), 0);

    // Client closes the connection to generate an EOF after the server reads the commands
    close(sv[0]);

    // Setup the server (port 0)
    TcpServer server(0);

    // Run the server logic on the other end of the socket pair 
    // The function will read the commands, run the App,  EOF, and exit
    EXPECT_NO_THROW({
        server.handleClient(sv[1]);
    });

    // Cleanup server socket
    close(sv[1]);
}