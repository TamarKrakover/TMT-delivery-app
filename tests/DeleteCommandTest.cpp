#include <gtest/gtest.h>
#include "DeleteCommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include "Exceptions.hpp"
#include <string>
#include <vector>
#include <map>
#include <memory>
#include <algorithm>

// Mock Output Writer
class MockOutputWriterDelete : public IOutputWriter {
public:
    std::string capturedMessage = "";
    void write(const std::string& message) override {
        capturedMessage += message;
    }
};

// Fake Repository
class FakeRepoForDelete : public IDataRepository {
public:
    std::map<std::string, std::vector<std::string>> fakeData;

    void saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {}
    std::vector<std::string> getUserViews(const std::string& userId) const override { 
        auto it = fakeData.find(userId);
        if (it != fakeData.end()) {
            return it->second;
        }
        return {};
    }
    bool loadAllData() override { return true; }
    std::map<std::string, std::vector<std::string>> getAllData() const override { return fakeData; }
    
    bool userExists(const std::string& userId) const override {
        return fakeData.find(userId) != fakeData.end();
    }
    
    void removeUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {
        // Simple mock implementation
        if (fakeData.find(userId) != fakeData.end()) {
            for (const auto& pid : productIds) {
                auto& prods = fakeData[userId];
                auto it = std::find(prods.begin(), prods.end(), pid);
                if (it != prods.end()) {
                    prods.erase(it);
                }
            }
        }
    }
};

class DeleteCommandTest : public ::testing::Test {
protected:
    MockOutputWriterDelete writer;
    FakeRepoForDelete repo;
};

// Test 1: Valid Delete operation
TEST_F(DeleteCommandTest, ValidDeleteOutputs204) {
    // Setup: User "1" exists with product "100"
    repo.fakeData["1"] = {"100"};
    DeleteCommand cmd(repo, writer);
    
    std::vector<std::string> args = {"1", "100"};
    cmd.execute(args);
    
    EXPECT_EQ(writer.capturedMessage, "204 No Content\n");
    EXPECT_TRUE(repo.fakeData["1"].empty()); // Product was removed
}

// Test 2: User not found throws exception
TEST_F(DeleteCommandTest, UserNotFoundThrows404) {
    // Empty repo
    DeleteCommand cmd(repo, writer);
    std::vector<std::string> args = {"99", "100"};
    
    EXPECT_THROW(cmd.execute(args), UserNotFoundException);
}

// Test 3: Invalid arguments throws exception 
TEST_F(DeleteCommandTest, InvalidArgsThrows400) {
    repo.fakeData["1"] = {"100"};

    DeleteCommand cmd(repo, writer);
    
    std::vector<std::string> args = {"1"}; // Missing product ID
    
    EXPECT_THROW(cmd.execute(args), InvalidArgumentsException);
}