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

// --- Mocks ---

namespace {
class MockInputSource : public IInputSource {
public:
    std::vector<std::string> inputsToFeed;
    size_t currentIndex = 0;

    std::string readNextLine() override {
        if (currentIndex < inputsToFeed.size()) {
            return inputsToFeed[currentIndex++];
        }
        throw std::runtime_error("EOF"); 
    }
};

class MockOutputWriter : public IOutputWriter {
public:
    std::string capturedOutput = "";
    void write(const std::string& message) override {
        capturedOutput += message;
    }
};

class FakeRepo : public IDataRepository {
public:
    std::map<std::string, std::vector<std::string>> data;
    void saveUserViews(const std::string& u, const std::vector<std::string>& p) override {
        data[u] = p;
    }
    bool loadAllData() override { return true; }
    std::map<std::string, std::vector<std::string>> getAllData() const override { return data; }
    std::vector<std::string> getUserViews(const std::string& u) const override { return {}; }
};
}

// --- Tests ---

class AppTest : public ::testing::Test {
protected:
    std::shared_ptr<MockInputSource> mockInput;
    std::shared_ptr<MockOutputWriter> mockOutput;
    std::unique_ptr<FakeRepo> fakeRepo;
    std::unique_ptr<Recommender> recommender;
    
    void SetUp() override {
        mockInput = std::make_shared<MockInputSource>();
        mockOutput = std::make_shared<MockOutputWriter>();
        fakeRepo = std::make_unique<FakeRepo>();
        recommender = std::make_unique<Recommender>(*fakeRepo);
    }
};

TEST_F(AppTest, ParsesAndExecutesValidCommand) {
    mockInput->inputsToFeed = {"add 1 100 101"};
    
    // Updated constructor call according to new signature
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    EXPECT_THROW(app.run(), std::runtime_error); 
    
    // Verify internal AddCommand was called by checking the repo
    ASSERT_EQ(fakeRepo->data.count("1"), 1);
    EXPECT_EQ(fakeRepo->data["1"].size(), 2);
}

TEST_F(AppTest, IgnoresUnknownCommand) {
    mockInput->inputsToFeed = {"delete 1 100"};
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    EXPECT_THROW(app.run(), std::runtime_error);
    EXPECT_EQ(mockOutput->capturedOutput, "400 Bad Request");
}

TEST_F(AppTest, HandlesEmptyInput) {
    mockInput->inputsToFeed = {"   ", ""};
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    // the empty string causes a clean break, so no exception should be thrown
    EXPECT_NO_THROW(app.run());
    EXPECT_TRUE(fakeRepo->data.empty());
}

// --- Test for Exception

// Test 1: Verify App catches BaseNotFoundException and outputs "404 Not Found\n"
TEST_F(AppTest, CatchesNotFoundExceptionAndOutputs404) {
    // A mock command that throws a not found exception
    class ThrowNotFoundCommand : public ICommand {
    public:
        void execute(const std::vector<std::string>& args) override {
            throw UserNotFoundException();
        }
    };

    commandMap["bad_logic_cmd"] = std::make_shared<ThrowNotFoundCommand>();
    mockInput->inputsToFeed = {"bad_logic_cmd 1 100"};
    
    App app(mockInput, mockOutput, commandMap);
    
    EXPECT_THROW(app.run(), std::runtime_error); 
    EXPECT_EQ(mockOutput->capturedOutput, "404 Not Found\n");
}

// Test 2: Verify App catches BaseBadRequestException and outputs "400 Bad Request\n"
TEST_F(AppTest, CatchesBadRequestExceptionAndOutputs400) {
    // A mock command that throws a bad request exception
    class ThrowBadRequestCommand : public ICommand {
    public:
        void execute(const std::vector<std::string>& args) override {
            throw InvalidArgumentsException();
        }
    };

    commandMap["invalid_format_cmd"] = std::make_shared<ThrowBadRequestCommand>();
    mockInput->inputsToFeed = {"invalid_format_cmd 1"};
    
    App app(mockInput, mockOutput, commandMap);
    
    EXPECT_THROW(app.run(), std::runtime_error); 
    EXPECT_EQ(mockOutput->capturedOutput, "400 Bad Request\n");
}