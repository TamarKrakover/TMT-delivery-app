#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string>

#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"

class SocketIOTest : public ::testing::Test {
protected:
    int sockets[2]; // Array to hold both ends of our connected pipeline

    void SetUp() override {
        // Create a pair of connected sockets. sockets[0] acts as the server, sockets[1] acts as the mock client
        if (socketpair(AF_UNIX, SOCK_STREAM, 0, sockets) < 0) {
            FAIL() << "Failed to create socket pair for testing";
        }
    }

    void TearDown() override {
        close(sockets[0]);
        close(sockets[1]);
    }
};

// verifies that the input source successfully reads a full line until a newline character
TEST_F(SocketIOTest, ReadsLineSuccessfully) {
    SocketInputSource inputSource(sockets[0]);
    
    // mock client sends a message containing a trailing newline
    std::string messageFromClient = "hello server\n";
    write(sockets[1], messageFromClient.c_str(), messageFromClient.length());
    
    // server reads the message from the stream
    std::string result = inputSource.readNextLine();
    
    EXPECT_EQ(result, "hello server");
}

// verifies that the input source gracefully handles EOF when the client disconnects
TEST_F(SocketIOTest, HandlesClientDisconnectOnRead) {
    SocketInputSource inputSource(sockets[0]);
    
    // close the client's end to simulate a sudden disconnection
    close(sockets[1]);
    
    // attempting to read after disconnection should return an empty string
    std::string result = inputSource.readNextLine();
    
    EXPECT_EQ(result, "");
}

// verifies that the output writer successfully writes a message and appends a newline
TEST_F(SocketIOTest, WritesMessageSuccessfully) {
    SocketOutputWriter outputWriter(sockets[0]);
    
    // server transmits a message response 
    std::string messageToClient = "400 Bad Request";
    outputWriter.write(messageToClient);
    
    // mock client reads the incoming message data    
    char buffer[256] = {0};
    int bytesRead = read(sockets[1], buffer, sizeof(buffer) - 1);
    
    ASSERT_GT(bytesRead, 0);
    std::string received(buffer);
    
    // verify that the message arrived intact with an automatically appended newline
    EXPECT_EQ(received, "400 Bad Request\n");
}

// verifies system behavior when provided with an invalid socket descriptor (e.g., -1)
TEST_F(SocketIOTest, HandlesInvalidSocketGracefully) {
    SocketInputSource inputSource(-1);
    SocketOutputWriter outputWriter(-1);
    
    // should handle the error safely and return an empty string instead of crashing
    std::string result = inputSource.readNextLine();
    EXPECT_EQ(result, "");
    
    // writing to an invalid socket should not throw any unexpected internal exceptions
    EXPECT_NO_THROW(outputWriter.write("test message"));
}