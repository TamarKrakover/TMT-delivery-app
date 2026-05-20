#include <gtest/gtest.h>
#include "PostCommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include "Exceptions.hpp"
#include <string>
#include <vector>
#include <map>
using namespace std;
// mock Writer
class MockOutputWriterPost : public IOutputWriter {
public:

    string capturedMessage = "";
    void write(const string& message) override {
        capturedMessage += message;
    }
};

// fake Repository
class FakeRepoForPost : public IDataRepository {
public:
    map<string, vector<string>> fakeData;
    
    void saveUserViews(const string& userId, const vector<string>& productIds) override {
        for(const auto& pid : productIds) {
            fakeData[userId].push_back(pid);
        }
    }

    bool userExists(const string& userId) const override {
        return fakeData.find(userId) != fakeData.end();
    }

    // unused overrides
    vector<string> getUserViews(const string& userId) const override { return {}; }
    bool loadAllData() override { return true; }
    map<string, vector<string>> getAllData() const override { return fakeData; }
    void removeUserViews(const string& userId, const vector<string>& productIds) override {}

};

// test fixture to provide a fresh repo and writer for each test
class PostCommandTest : public ::testing::Test {
protected:
    MockOutputWriterPost writer;
    FakeRepoForPost repo;
};

// test 1: valid POST, checks 201 created
TEST_F(PostCommandTest, ValidPost) {
    PostCommand cmd(repo, writer);
    vector<string> args = {"1", "101", "102"};
    cmd.execute(args);

    EXPECT_EQ(writer.capturedMessage, "201 Created\n");
    EXPECT_EQ(repo.fakeData["1"].size(), 2);
}

// test 2: user already exists
TEST_F(PostCommandTest, UserAlreadyExists) {
    repo.fakeData["1"] = {"100"}; // create a new user
    PostCommand cmd(repo, writer);
    vector<string> args = {"1", "101"};

    EXPECT_THROW(cmd.execute(args), UserAlreadyExistsException);
}

// test 3: invalid arguments
TEST_F(PostCommandTest, InvalidArgs) {
    PostCommand cmd(repo, writer);
    vector<string> args = {"1"};

    EXPECT_THROW(cmd.execute(args), InvalidArgumentsException);
}