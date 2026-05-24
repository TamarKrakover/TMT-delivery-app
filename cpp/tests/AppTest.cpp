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
using namespace std;
namespace {
// mock class to simulate user input instead of reading from a real socket or console
class MockInputSource : public IInputSource {
public:
    vector<string> inputsToFeed; // list of simulated commands
    size_t currentIndex = 0;

    // returns the next simulated line or simulates a disconnect when out of commands
    string readNextLine() override {
        if (currentIndex < inputsToFeed.size()) {
            return inputsToFeed[currentIndex++];
        }
        return "CLIENT_DISCONNECTED"; 
    }
};

// mock class to capture the application's output for verification during tests
class MockOutputWriter : public IOutputWriter {
public:
    string capturedOutput = "";
    // appends the written message to the captured output string
    void write(const string& message) override {
        capturedOutput += message;
    }
};

// fake repository to simulate database/file storage in memory
class FakeRepo : public IDataRepository {
public:
    map<string, vector<string>> data; // in-memory storage
    void saveUserViews(const string& u, const vector<string>& p) override {
        data[u] = p;
    }
    bool loadAllData() override { return true; }
    map<string, vector<string>> getAllData() const override { return data; }
    vector<string> getUserViews(const string& u) const override { return {}; }
    bool userExists(const string& u) const override { return data.find(u) != data.end(); }
    void removeUserViews(const string& u, const vector<string>& p) override {}
};
}

class AppTest : public ::testing::Test {
protected:
    shared_ptr<MockInputSource> mockInput;
    shared_ptr<MockOutputWriter> mockOutput;
    unique_ptr<FakeRepo> fakeRepo;
    unique_ptr<Recommender> recommender;
    
    // setup runs before each test to initialize clean mocks and dependencies
    void SetUp() override {
        mockInput = make_shared<MockInputSource>();
        mockOutput = make_shared<MockOutputWriter>();
        fakeRepo = make_unique<FakeRepo>();
        recommender = make_unique<Recommender>(*fakeRepo);
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