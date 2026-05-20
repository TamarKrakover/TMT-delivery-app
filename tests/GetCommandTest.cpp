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
using namespace std;
class MockOutputWriterGet : public IOutputWriter {
public: 
    string capturedMessage = "";
    void write(const string& message) override {
        capturedMessage += message;
    }
};

// Fake Repository for GET
class FakeRepoForGet : public IDataRepository {
public:
    map<string, vector<string>> fakeData;

    void saveUserViews(const string& userId, const vector<string>& productIds) override {}
    bool loadAllData() override { return true; }
    map<string, vector<string>> getAllData() const override { return fakeData; }
    
    vector<string> getUserViews(const string& userId) const override {
        auto it = fakeData.find(userId);
        if (it != fakeData.end()) {
            return it->second;
        }
        return {}; 
    }

    bool userExists(const string& userId) const override {
        return fakeData.find(userId) != fakeData.end();
    }
    
    void removeUserViews(const string& userId, const vector<string>& productIds) override {}
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
    vector<string> args = {"1", "100"};

    cmd.execute(args);

    // Expecting exactly the 200 Ok with double newline, 
    // followed by the recommendation
    EXPECT_EQ(writer.capturedMessage, "200 Ok\n\n105\n");
}

// Test 2: Invalid arguments length throws 400
TEST_F(GetCommandTest, InvalidArgsThrows400) {
    GetCommand cmd(repo, *recommender, writer);
    vector<string> args ={"1"};

    EXPECT_THROW(cmd.execute(args), InvalidArgumentsException);
}

// Test 3: User not found throws 404
TEST_F(GetCommandTest, UserNotFoundThrows404) {
    GetCommand cmd(repo, *recommender, writer);
    vector<string> args = {"99", "100"};
    
    EXPECT_THROW(cmd.execute(args), UserNotFoundException);
}