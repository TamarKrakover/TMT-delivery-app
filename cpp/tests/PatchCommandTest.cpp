#include <gtest/gtest.h>
#include "PatchCommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include "Exceptions.hpp"
#include <string>
#include <vector>
#include <map>
using namespace std;
// mock writer to capture output instead of sending it
class MockOutputWriterPatch : public IOutputWriter {
public:
    string capturedMessage = "";
    void write(const string& message) override {
        capturedMessage += message;
    }
};

// fake in memory repository
class FakeRepoForPatch : public IDataRepository {
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

    // unused interface methods, required for compilation
    vector<string> getUserViews(const string& userId) const override { return {}; }
    bool loadAllData() override { return true; }
    map<string, vector<string>> getAllData() const override { return fakeData; }
    void removeUserViews(const string& userId, const vector<string>& productIds) override {}

};

// test fixture to provide a fresh repo and writer for each test
class PatchCommandTest : public ::testing::Test {
protected:
    MockOutputWriterPatch writer;
    FakeRepoForPatch repo;
};

// tests successful PATCH: valid input updates data and outputs 204
TEST_F(PatchCommandTest, ValidPatchOutputs204) {
    repo.fakeData["1"] = {"100"};
    PatchCommand cmd(repo, writer);
    vector<string> args = {"1", "101", "102"};
    cmd.execute(args);

    EXPECT_EQ(writer.capturedMessage, "204 No Content\n");
    EXPECT_EQ(repo.fakeData["1"].size(), 3);
}

// tests logic error: attempting to patch a non-existent user
TEST_F(PatchCommandTest, UserNotFound) {
    PatchCommand cmd(repo, writer);
    vector<string> args = {"99", "100"};
    EXPECT_THROW(cmd.execute(args), UserNotFoundException);
}
 // tests input validation: missing product arguments
TEST_F(PatchCommandTest, InvalidArgs) {
    repo.fakeData["1"] = {"100"};
    PatchCommand cmd(repo, writer);
    vector<string> args = {"1"};
    EXPECT_THROW(cmd.execute(args), InvalidArgumentsException);
}