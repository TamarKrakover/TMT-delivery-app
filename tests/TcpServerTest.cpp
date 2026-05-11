#include <gtest/gtest.h>
#include <memory>
#include <cstdio>
#include <string>

#include "TcpServer.hpp"
#include "App.hpp"
#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"
#include "FileDataRepository.hpp"
#include "Recommender.hpp"

class TcpServerBasicTest : public ::testing::Test {
protected:
    std::string dummyFile = "dummy_server_test_data.txt";

    void TearDown() override {
        std::remove(dummyFile.c_str());
    }
};

// Basic test to ensure the server can be initialized without crashing
TEST_F(TcpServerBasicTest, InitializationDoesNotCrash) {
    // 1. Initialize dependencies with disconnected sockets (-1)
    auto input = std::make_shared<SocketInputSource>(-1);
    auto output = std::make_shared<SocketOutputWriter>(-1);
    FileDataRepository repo(dummyFile);
    Recommender recommender(repo);
    App app(input, output, repo, recommender);

    // 2. Create the server - test passes if no exception is thrown
    EXPECT_NO_THROW({
        TcpServer server(5555, app, input, output);
    });
}