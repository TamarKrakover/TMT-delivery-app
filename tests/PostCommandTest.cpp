#include <gtest/gtest.h>
#include "PostCommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include "Exceptions.hpp"
#include <string>
#include <vector>
#include <map>

// mock Writer
class MockOutputWriterPost : public IOutputWriter {
public:

    std::string capturedMessage = "";
    void write(const std::string& message) override {
        capturedMessage += message;
    }
};

// fake Repository
class FakeRepoForPost : public IDataRepository {
public:
    std::map<std::string, std::vector<std::string>> fakeData;
    
    void saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {
        for(const auto& pid : productIds) {
            fakeData[userId].push_back(pid);
        }
    }

    bool userExists(const std::string& userId) const override {
        return fakeData.find(userId) != fakeData.end();
    }

    // unused overrides
    std::vector<std::string> getUserViews(const std::string& userId) const override { return {}; }
    bool loadAllData() override { return true; }
    std::map<std::string, std::vector<std::string>> getAllData() const override { return fakeData; }
    void removeUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {}

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
    std::vector<std::string> args = {"1", "101", "102"};
    cmd.execute(args);

    EXPECT_EQ(writer.capturedMessage, "201 Created\n");
    EXPECT_EQ(repo.fakeData["1"].size(), 2);
}

// test 2: user already exists
TEST_F(PostCommandTest, UserAlreadyExists) {
    repo.fakeData["1"] = {"100"}; // create a new user
    PostCommand cmd(repo, writer);
    std::vector<std::string> args = {"1", "101"};

    EXPECT_THROW(cmd.execute(args), UserAlreadyExistsException);
}

// test 3: invalid arguments
TEST_F(PostCommandTest, InvalidArgs) {
    PostCommand cmd(repo, writer);
    std::vector<std::string> args = {"1"};

    EXPECT_THROW(cmd.execute(args), InvalidArgumentsException);
}