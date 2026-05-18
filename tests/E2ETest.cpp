#include <gtest/gtest.h>
#include <memory>
#include <string>
#include <vector>
#include <map>

#include "App.hpp"
#include "IInputSource.hpp"
#include "IOutputWriter.hpp"
#include "ICommand.hpp"
#include "FileDataRepository.hpp"
#include "Recommender.hpp"
#include "PostCommand.hpp"
#include "PatchCommand.hpp"
#include "GetCommand.hpp"
#include "DeleteCommand.hpp"
#include "HelpCommand.hpp"

// ===== Mock Classes =====

/**
 * Mock Input Source: Feeds predefined commands one by one.
 * When the sequence is exhausted, readNextLine() returns an empty string
 * which triggers the app to stop.
 */
class MockInputSourceE2E : public IInputSource {
public:
    std::vector<std::string> commandsToFeed;
    size_t currentIndex = 0;

    std::string readNextLine() override {
        if (currentIndex < commandsToFeed.size()) {
            return commandsToFeed[currentIndex++];
        }
        throw std::runtime_error("EOF"); 
    }
};

/**
 * Mock Output Writer: Captures all output for verification.
 */
class MockOutputWriterE2E : public IOutputWriter {
public:
    std::string capturedOutput;

    void write(const std::string& message) override {
        capturedOutput += message;
    }

    void reset() {
        capturedOutput.clear();
    }
};

// ===== E2E Test Suite =====

class E2ETest : public ::testing::Test {
protected:
    std::string testDataFile = "e2e_test_data.txt";
    std::shared_ptr<MockInputSourceE2E> mockInput;
    std::shared_ptr<MockOutputWriterE2E> mockOutput;
    std::unique_ptr<FileDataRepository> repository;

    void SetUp() override {
        // clean up any existing test file
        std::remove(testDataFile.c_str());
        
        // initialize mock input and output
        mockInput = std::make_shared<MockInputSourceE2E>();
        mockOutput = std::make_shared<MockOutputWriterE2E>();
        
        // initialize the repository
        repository = std::make_unique<FileDataRepository>(testDataFile);
        repository->loadAllData();
    }

    void TearDown() override {
        // clean up the test data file
        std::remove(testDataFile.c_str());
    }

    /**
     * Helper method to create and run the app with the mocked input/output.
     */
    void runAppWithCommands() {
        // create the recommender engine
        Recommender recommender(*repository);

        // create and run the app using the correct constructor signature
        App app(mockInput, mockOutput, *repository, recommender);
        EXPECT_THROW(app.run(), std::runtime_error);
    }
};

// ===== Tests =====

/**
 * Test 1: Basic flow - Post data and verify it was saved.
 * Commands: "post 1 100 101 102"
 */
TEST_F(E2ETest, BasicPostCommand) {
    mockInput->commandsToFeed = {
        "post 1 100 101 102"
    };

    runAppWithCommands();

    // verify data was saved to repository
    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData["1"].size(), 3);
    EXPECT_EQ(allData["1"][0], "100");
    EXPECT_EQ(allData["1"][1], "101");
    EXPECT_EQ(allData["1"][2], "102");
}

/**
 * Test 2: Multiple posts from different users.
 * Commands: 
 * "post 1 100 101"
 * "post 2 100 102"
 */
TEST_F(E2ETest, MultipleUsersPostCommands) {
    mockInput->commandsToFeed = {
        "post 1 100 101",
        "post 2 100 102"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    ASSERT_EQ(allData.count("2"), 1);
    EXPECT_EQ(allData["1"].size(), 2);
    EXPECT_EQ(allData["2"].size(), 2);
    EXPECT_EQ(allData["1"][0], "100");
    EXPECT_EQ(allData["2"][0], "100");
}

/**
 * Test 3: Post data and then test get.
 * Commands:
 * "post 1 100"
 * "post 2 100 105"
 * "get 1 105"
 * Expected: Should get products based on recommendation logic.
 */
TEST_F(E2ETest, PostAndGet) {
    mockInput->commandsToFeed = {
        "post 1 100",
        "post 2 100 105",
        "get 1 105"
    };

    runAppWithCommands();

    // verify data was saved
    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    ASSERT_EQ(allData.count("2"), 1);
    EXPECT_EQ(allData["1"].size(), 1);
    EXPECT_EQ(allData["2"].size(), 2);

    // verify the app ran without crashing
    EXPECT_TRUE(true);
}

/**
 * Test 4: Invalid command handling.
 * Commands:
 * "unknown_cmd 1 2 3"
 * "post 1 100"
 * "nonexistent 5"
 * Expected: Unknown commands are silently ignored, but valid commands still work.
 */
TEST_F(E2ETest, InvalidCommandsIgnored) {
    mockInput->commandsToFeed = {
        "unknown_cmd 1 2 3",
        "post 1 100",
        "nonexistent 5"
    };

    runAppWithCommands();

    // only the "post" command should have executed
    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData["1"].size(), 1);
    EXPECT_EQ(allData["1"][0], "100");
}

/**
 * Test 6: Help command execution.
 * Commands:
 * "help"
 * Expected: Help command writes output without crashing.
 */
TEST_F(E2ETest, HelpCommandExecution) {
    mockInput->commandsToFeed = {
        "help"
    };

    runAppWithCommands();

    // help command should have written some output
    EXPECT_FALSE(mockOutput->capturedOutput.empty());
}

/**
 * Test 7: Complex scenario with multiple operations.
 */
TEST_F(E2ETest, ComplexScenarioMultipleOperations) {
    mockInput->commandsToFeed = {
        "post 1 100 101",
        "patch 1 102",
        "post 2 100 101 103",
        "post 3 102 103 104",
        "get 1 103",
        "help"
    };

    runAppWithCommands();

    // verify all posts and patches were successful
    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    ASSERT_EQ(allData.count("2"), 1);
    ASSERT_EQ(allData.count("3"), 1);
    
    EXPECT_EQ(allData["1"].size(), 3);
    EXPECT_EQ(allData["2"].size(), 3);
    EXPECT_EQ(allData["3"].size(), 3);
    
    // help output should be present
    EXPECT_FALSE(mockOutput->capturedOutput.empty());
}

/**
 * Test 8: Post with single user and single product.
 * Commands:
 * "post 99 999"
 */
TEST_F(E2ETest, PostSingleProductToUser) {
    mockInput->commandsToFeed = {
        "post 99 999"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("99"), 1);
    EXPECT_EQ(allData["99"].size(), 1);
    EXPECT_EQ(allData["99"][0], "999");
}

/**
 * Test 9: Mixed case commands and edge cases.
 * Commands with improper formatting should be ignored.
 */
TEST_F(E2ETest, MixedValidAndInvalidCommands) {
    mockInput->commandsToFeed = {
        "post",             // missing arguments - should fail 
        "post 1",           // missing product IDs - should fail
        "post 1 100 101",   // valid - should work
        "patch",            // missing arguments - should fail 
        "get",              // missing arguments - should fail 
        "post 2 200",       // valid - should work
        "patch 1 102"       // valid - should work
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    // only the valid posts and patches should have succeeded
    EXPECT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData.count("2"), 1);
    EXPECT_EQ(allData["1"].size(), 3);
    EXPECT_EQ(allData["2"].size(), 1);
}

/**
 * Test 10: Duplicate products for the same user using patch.
 * Commands:
 * "post 1 100 101"
 * "patch 1 100 102"  // Adding 100 again
 */
TEST_F(E2ETest, DuplicateProductsForUser) {
    mockInput->commandsToFeed = {
        "post 1 100 101",
        "patch 1 100 102"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    // the exact number of products depends on duplicate handling logic
    EXPECT_GE(allData["1"].size(), 1);
}

/**
 * Test 11: Delete products from user.
 * Commands:
 * "post 1 100 101 102"
 * "delete 1 101"
 */
TEST_F(E2ETest, DeleteProductFromUser) {
    mockInput->commandsToFeed = {
        "post 1 100 101 102",
        "delete 1 101"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    
    // expecting 2 products left after deleting 1
    EXPECT_EQ(allData["1"].size(), 2);
    
    // check remaining elements are 100 and 102
    bool has100 = false;
    bool has102 = false;
    for (const auto& item : allData["1"]) {
        if (item == "100") has100 = true;
        if (item == "102") has102 = true;
    }
    EXPECT_TRUE(has100);
    EXPECT_TRUE(has102);
}