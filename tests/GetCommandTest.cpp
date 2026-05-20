#include <gtest/gtest.h>
#include "GetCommand.hpp"
#include "Recommender.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include "Exceptions.hpp"
#include <string>
#include <vector>
#include <map>
#include <algorithm>

class MockOutputWriterGet : public IOutputWriter {
public: 
    std::string capturedMessage = "";
    void write(const std::string& message) override {
        capturedMessage += message;
    }
};

// Fake Repository for GET
class FakeRepoForGet : public IDataRepository {
public:
    std::map<std::string, std::vector<std::string>> fakeData;

    void saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {}
    bool loadAllData() override { return true; }
    std::map<std::string, std::vector<std::string>> getAllData() const override { return fakeData; }
    
    std::vector<std::string> getUserViews(const std::string& userId) const override {
        auto it = fakeData.find(userId);
        if (it != fakeData.end()) {
            return it->second;
        }
        return {}; 
    }

    bool userExists(const std::string& userId) const override {
        return fakeData.find(userId) != fakeData.end();
    }
    
    void removeUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {}
};

class GetCommandTest : public ::testing::Test {
protected:
    MockOutputWriterGet writer;
    FakeRepoForGet repo;
    Recommender* recommender;

    void SetUp() override {
        recommender = new Recommender(repo);
    }

    void TearDown() override {
        delete recommender;
    }
};

// Test 1: Valid GET outputs 200 Ok + recommendations
TEST_F(GetCommandTest, ValidGetOutputs200AndRecommendations) {
    // User 1 watched 100
    // User 2 watched 100, 105
    repo.fakeData["1"] = {"100"};
    repo.fakeData["2"] = {"100", "105"};

    GetCommand cmd(repo, *recommender, writer);
    std::vector<std::string> args = {"1", "100"};

    cmd.execute(args);

    // Expecting exactly the 200 Ok with double newline, 
    // followed by the recommendation
    EXPECT_EQ(writer.capturedMessage, "200 Ok\n\n105\n");
}

// Test 2: Invalid arguments length throws 400
TEST_F(GetCommandTest, InvalidArgsThrows400) {
    GetCommand cmd(repo, *recommender, writer);
    std::vector<std::string> args ={"1"};

    EXPECT_THROW(cmd.execute(args), InvalidArgumentsException);
}

// Test 3: User not found throws 404
TEST_F(GetCommandTest, UserNotFoundThrows404) {
    GetCommand cmd(repo, *recommender, writer);
    std::vector<std::string> args = {"99", "100"};
    
    EXPECT_THROW(cmd.execute(args), UserNotFoundException);
}