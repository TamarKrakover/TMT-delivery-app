#include <gtest/gtest.h>
#include "PatchCommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include "Exceptions.hpp"
#include <string>
#include <vector>
#include <map>

// mock writer to capture output instead of sending it
class MockOutputWriterPatch : public IOutputWriter {
public:
    std::string capturedMessage = "";
    void write(const std::string& message) override {
        capturedMessage += message;
    }
};

// fake in memory repository
class FakeRepoForPatch : public IDataRepository {
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

    // unused interface methods, required for compilation
    std::vector<std::string> getUserViews(const std::string& userId) const override { return {}; }
    bool loadAllData() override { return true; }
    std::map<std::string, std::vector<std::string>> getAllData() const override { return fakeData; }
    void removeUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {}

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
    std::vector<std::string> args = {"1", "101", "102"};
    cmd.execute(args);

    EXPECT_EQ(writer.capturedMessage, "204 No Content\n");
    EXPECT_EQ(repo.fakeData["1"].size(), 3);
}

// tests logic error: attempting to patch a non-existent user
TEST_F(PatchCommandTest, UserNotFound) {
    PatchCommand cmd(repo, writer);
    std::vector<std::string> args = {"99", "100"};
    EXPECT_THROW(cmd.execute(args), UserNotFoundException);
}
 // tests input validation: missing product arguments
TEST_F(PatchCommandTest, InvalidArgs) {
    repo.fakeData["1"] = {"100"};
    PatchCommand cmd(repo, writer);
    std::vector<std::string> args = {"1"};
    EXPECT_THROW(cmd.execute(args), InvalidArgumentsException);
}