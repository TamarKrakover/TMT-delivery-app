#include <gtest/gtest.h>
#include <vector>
#include <string>
#include <memory>
#include <map>

#include "App.hpp"
#include "IInputSource.hpp"
#include "IOutputWriter.hpp"
#include "IDataRepository.hpp"
#include "Recommender.hpp"
#include "Exceptions.hpp"

namespace {
// mock class to simulate user input instead of reading from a real socket or console
class MockInputSource : public IInputSource {
public:
    std::vector<std::string> inputsToFeed; // list of simulated commands
    size_t currentIndex = 0;

    // returns the next simulated line or simulates a disconnect when out of commands
    std::string readNextLine() override {
        if (currentIndex < inputsToFeed.size()) {
            return inputsToFeed[currentIndex++];
        }
        return "CLIENT_DISCONNECTED"; 
    }
};

// mock class to capture the application's output for verification during tests
class MockOutputWriter : public IOutputWriter {
public:
    std::string capturedOutput = "";
    // appends the written message to the captured output string
    void write(const std::string& message) override {
        capturedOutput += message;
    }
};

// fake repository to simulate database/file storage in memory
class FakeRepo : public IDataRepository {
public:
    std::map<std::string, std::vector<std::string>> data; // in-memory storage
    void saveUserViews(const std::string& u, const std::vector<std::string>& p) override {
        data[u] = p;
    }
    bool loadAllData() override { return true; }
    std::map<std::string, std::vector<std::string>> getAllData() const override { return data; }
    std::vector<std::string> getUserViews(const std::string& u) const override { return {}; }
    bool userExists(const std::string& u) const override { return data.find(u) != data.end(); }
    void removeUserViews(const std::string& u, const std::vector<std::string>& p) override {}
};
}

class AppTest : public ::testing::Test {
protected:
    std::shared_ptr<MockInputSource> mockInput;
    std::shared_ptr<MockOutputWriter> mockOutput;
    std::unique_ptr<FakeRepo> fakeRepo;
    std::unique_ptr<Recommender> recommender;
    
    // setup runs before each test to initialize clean mocks and dependencies
    void SetUp() override {
        mockInput = std::make_shared<MockInputSource>();
        mockOutput = std::make_shared<MockOutputWriter>();
        fakeRepo = std::make_unique<FakeRepo>();
        recommender = std::make_unique<Recommender>(*fakeRepo);
    }
};

// Test verifying that a valid command is properly parsed and executed
TEST_F(AppTest, ParsesAndExecutesValidCommand) {
    mockInput->inputsToFeed = {"post 1 100 101"};
    
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    EXPECT_NO_THROW(app.run()); 
    
    ASSERT_EQ(fakeRepo->data.count("1"), 1);
    EXPECT_EQ(fakeRepo->data["1"].size(), 2);
}

// Test verifying that an unknown command returns a 400 Bad Request error
TEST_F(AppTest, IgnoresUnknownCommand) {
    mockInput->inputsToFeed = {"recommend 1 100"};
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    EXPECT_NO_THROW(app.run());
    // Expect a newline character at the end
    EXPECT_EQ(mockOutput->capturedOutput, "400 Bad Request\n");
}

// Test verifying that empty inputs or just spaces are handled safely
TEST_F(AppTest, HandlesEmptyInput) {
    mockInput->inputsToFeed = {"   ", ""};
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    EXPECT_NO_THROW(app.run());
    EXPECT_TRUE(fakeRepo->data.empty());
}