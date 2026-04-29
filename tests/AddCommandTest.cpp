#include <gtest/gtest.h>
#include "AddCommand.hpp"
#include "FileDataRepository.hpp"
#include <vector>
#include <string>
#include <memory>
#include <cstdio>

class AddCommandTest : public ::testing::Test {
protected:
    std::string testFile = "add_cmd_test.txt";
    std::unique_ptr<FileDataRepository> repo;

    void SetUp() override {
        // Ensure a clean state for each test
        std::remove(testFile.c_str());
        repo = std::make_unique<FileDataRepository>(testFile);
    }

    void TearDown() override {
        std::remove(testFile.c_str());
    }
};

// Test that a valid command correctly saves data to the repository
TEST_F(AddCommandTest, ExecuteValidAddCommand) {
    AddCommand addCmd(*repo);
    // Format: [userid, productid1, productid2, ...]
    std::vector<std::string> args = {"user123", "p101", "p102"};
    
    addCmd.execute(args);
    
    auto data = repo->getAllData();
    ASSERT_EQ(data.count("user123"), 1);
    EXPECT_EQ(data["user123"].size(), 2);
    EXPECT_EQ(data["user123"][0], "p101");
    EXPECT_EQ(data["user123"][1], "p102");
}

// Test that an invalid command (missing product IDs) does not modify the repository
TEST_F(AddCommandTest, ExecuteInvalidAddCommand) {
    AddCommand addCmd(*repo);
    // Invalid: only userId provided, no productIds
    std::vector<std::string> args = {"user123"}; 
    
    addCmd.execute(args);
    
    auto data = repo->getAllData();
    EXPECT_TRUE(data.empty());
}