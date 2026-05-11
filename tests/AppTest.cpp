#include <gtest/gtest.h>
#include <vector>
#include <string>
#include <memory>
#include <map>

#include "App.hpp"
#include "IInputSource.hpp"
#include "IOutputWriter.hpp"
#include "ICommand.hpp"
#include "Exceptions.hpp"

// --- Mocks ---

// Fake Input Source: Feeds predefined strings one by one
class MockInputSource : public IInputSource {
public:
    std::vector<std::string> inputsToFeed;
    size_t currentIndex = 0;

    std::string readNextLine() override {
        if (currentIndex < inputsToFeed.size()) {
            return inputsToFeed[currentIndex++];
        }
        // Throw exception to break the infinite loop
        throw std::runtime_error("EOF"); 
    }
};

// Fake Output Writer: Captures output for verification
class MockOutputWriter : public IOutputWriter {
public:
    std::string capturedOutput = "";

    void write(const std::string& message) override {
        capturedOutput += message;
    }
};

// Fake Command: Records if it was executed and with what arguments
class MockCommand : public ICommand {
public:
    bool wasExecuted = false;
    std::vector<std::string> receivedArgs;

    void execute(const std::vector<std::string>& args) override {
        wasExecuted = true;
        receivedArgs = args;
    }
};

// --- Tests ---

class AppTest : public ::testing::Test {
protected:
    std::shared_ptr<MockInputSource> mockInput;
    std::shared_ptr<MockOutputWriter> mockOutput;
    std::map<std::string, std::shared_ptr<ICommand>> commandMap;
    std::shared_ptr<MockCommand> mockAddCmd;
    
    void SetUp() override {
        mockInput = std::make_shared<MockInputSource>();
        mockOutput = std::make_shared<MockOutputWriter>();
        
        mockAddCmd = std::make_shared<MockCommand>();
        commandMap["add"] = mockAddCmd;
    }
};

// Test 1: Verify valid command parsing and execution
TEST_F(AppTest, ParsesAndExecutesValidCommand) {
    // We mock typing "add 1 100 101"
    mockInput->inputsToFeed = {"add 1 100 101"};
    
    App app(mockInput, mockOutput, commandMap);
    
    // Catch the exception we threw to let the test finish successfully
    EXPECT_THROW(app.run(), std::runtime_error); 
    
    EXPECT_TRUE(mockAddCmd->wasExecuted);
    // The App should pass the arguments correctly (excluding the command name itself)
    ASSERT_EQ(mockAddCmd->receivedArgs.size(), 3);
    EXPECT_EQ(mockAddCmd->receivedArgs[0], "1");
    EXPECT_EQ(mockAddCmd->receivedArgs[1], "100");
    EXPECT_EQ(mockAddCmd->receivedArgs[2], "101");
}

// Test 2: Verify unknown commands are ignored
TEST_F(AppTest, IgnoresUnknownCommand) {
    // We mock typing an unknown command
    mockInput->inputsToFeed = {"delete 1 100"};
    
    App app(mockInput, mockOutput, commandMap);
    
    // Catch the exception here as well
    EXPECT_THROW(app.run(), std::runtime_error);
    
    // The AddCommand should NOT have been executed
    EXPECT_FALSE(mockAddCmd->wasExecuted);
}

// Test 3: Verify empty input is handled correctly
TEST_F(AppTest, HandlesEmptyInput) {
    // Provide blank spaces, then empty string
    mockInput->inputsToFeed = {"   ", ""};
    
    App app(mockInput, mockOutput, commandMap);
    
    // Catch the exception here as well
    EXPECT_THROW(app.run(), std::runtime_error);
    
    EXPECT_FALSE(mockAddCmd->wasExecuted);
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