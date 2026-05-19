#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string>

#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"

class SocketIOTest : public ::testing::Test {
protected:
    int sockets[2]; 

    void SetUp() override {
        if (socketpair(AF_UNIX, SOCK_STREAM, 0, sockets) < 0) {
            FAIL() << "Failed to create socket pair for testing";
        }
    }

    void TearDown() override {
        close(sockets[0]);
        close(sockets[1]);
    }
};


TEST_F(SocketIOTest, ReadsLineSuccessfully) {
    SocketInputSource inputSource(sockets[0]);
    std::string messageFromClient = "hello server\n";
    write(sockets[1], messageFromClient.c_str(), messageFromClient.length());
    std::string result = inputSource.readNextLine();
    
    EXPECT_EQ(result, "hello server");
}
TEST_F(SocketIOTest, HandlesClientDisconnectOnRead) {
    SocketInputSource inputSource(sockets[0]);
    
    close(sockets[1]);
    
    std::string result = inputSource.readNextLine();
    
    // Expect the disconnection string
    EXPECT_EQ(result, "CLIENT_DISCONNECTED");
}

TEST_F(SocketIOTest, WritesMessageSuccessfully) {
    SocketOutputWriter outputWriter(sockets[0]);
    
    std::string messageToClient = "400 Bad Request";
    outputWriter.write(messageToClient);
    
    char buffer[256] = {0};
    int bytesRead = read(sockets[1], buffer, sizeof(buffer) - 1);
    
    ASSERT_GT(bytesRead, 0);
    std::string received(buffer);
    
    EXPECT_EQ(received, "400 Bad Request\n");
}

TEST_F(SocketIOTest, HandlesInvalidSocketGracefully) {
    SocketInputSource inputSource(-1);
    SocketOutputWriter outputWriter(-1);
    
    std::string result = inputSource.readNextLine();
    
    // Expect the disconnection string
    EXPECT_EQ(result, "CLIENT_DISCONNECTED");
    
    EXPECT_NO_THROW(outputWriter.write("test message"));
}