#include <gtest/gtest.h>
#include "TcpServer.hpp"
#include "FileDataRepository.hpp"
#include "Recommender.hpp"
#include <sys/socket.h>
#include <unistd.h>
#include <string>

TEST(TcpServerTest, HandlesClientAndExitsGracefullyOnEOF) {
    int sv[2];
    ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sv), 0);

    // Client writes commands into its end of the socket pair
    std::string commands = "help\nadd 1 200 300\n";
    send(sv[0], commands.c_str(), commands.length(), 0);

    // Client closes the connection to generate an EOF
    close(sv[0]);

    // Create the required dependencies for the server
    FileDataRepository repo("test_data.txt");
    Recommender recommender(repo);

    // Setup the server with port 0 and the required dependencies
    TcpServer server(0, repo, recommender);

    EXPECT_NO_THROW({
        server.handleClient(sv[1]);
    });

    close(sv[1]);
}