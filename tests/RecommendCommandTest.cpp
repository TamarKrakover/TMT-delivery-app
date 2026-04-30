#include <gtest/gtest.h>
#include "RecommendCommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include <string>
#include <vector>
#include <map>

// Captures output in a string for testing instead of printing to the console.
class StubWriter : public IOutputWriter {
public:
    std::string capturedMessage = "";
    void write(const std::string& message) override {
        capturedMessage += message;
    }
};

// Fake repository to satisfy Recommender dependencies without actual file I/O.
class DummyRepository : public IDataRepository {
public:
    std::map<std::string, std::vector<std::string>> fakeData;
    void saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {}
    std::map<std::string, std::vector<std::string>> getAllData() const override { return fakeData; }
    bool loadAllData() override { return true; }
};

// Test fixture that sets up the environment for RecommendCommand tests.
class RecommendCommandTest : public ::testing::Test {
protected:
    StubWriter writer;
    DummyRepository repo;
    Recommender engine;
    RecommendCommand cmd;

    // Initialize objects in dependency order.
    RecommendCommandTest() : engine(repo), cmd(engine, writer) {}

    void SetUp() override {
        // Reset the captured message before each test runs.
        writer.capturedMessage = "";
    }
};

// TTest 1: Verify command ignores input with fewer than 2 arguments.
TEST_F(RecommendCommandTest, IgnoreInsufficientArguments) {
    // 1 argument only.
    std::vector<std::string> tooFewArgs = {"1"}; 
    // Execute the command with the invalid input.
    cmd.execute(tooFewArgs);
    // Output should remain empty.
    EXPECT_EQ(writer.capturedMessage, "");
}

// Test 2: // Verify command ignores input with more than 2 arguments.
TEST_F(RecommendCommandTest, IgnoreTooManyArguments) {
    // Prepare an invalid input vector (more than 2 argument).
    std::vector<std::string> tooFewArgs = {"1", "100", "101"}; 
    // Execute the command with the invalid input.
    cmd.execute(tooFewArgs);
    // Output should remain empty.
    EXPECT_EQ(writer.capturedMessage, "");
}

// Test 3: Verify valid recommendations are printed space-separated, ending with a newline.
TEST_F(RecommendCommandTest, PrintsRecommendationsCorrectly) {
    // Inject fake data.
    // User 1 and 2 share product "100". User 2 also watched "104" and "105".
    repo.fakeData["1"] = {"100"};
    repo.fakeData["2"] = {"100", "104", "105"};
    
    std::vector<std::string> validArgs = {"1", "104"};

    // Recommending for user "1" based on "104" should yield "105" based on user 2's history.
    cmd.execute(validArgs);

    // Assert: The output must be the recommended product(s) followed by a newline.
    EXPECT_EQ(writer.capturedMessage, "105\n");
}