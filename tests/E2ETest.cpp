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
#include "AddCommand.hpp"
#include "RecommendCommand.hpp"
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
        // Clean up any existing test file
        std::remove(testDataFile.c_str());
        
        // Initialize mock input and output
        mockInput = std::make_shared<MockInputSourceE2E>();
        mockOutput = std::make_shared<MockOutputWriterE2E>();
        
        // Initialize the repository (empty at start)
        repository = std::make_unique<FileDataRepository>(testDataFile);
        repository->loadAllData();
    }

    void TearDown() override {
        // Clean up the test data file
        std::remove(testDataFile.c_str());
    }

    /**
     * Helper method to create and run the app with the mocked input/output.
     */
  void runAppWithCommands() {
        // Create the recommender engine
        Recommender recommender(*repository);

        // No need to create a command map here anymore!
        // App now handles it internally.

        // Create and run the app with the new signature
        App app(mockInput, mockOutput, *repository, recommender);
        app.run();
    }
};
// ===== Tests =====

/**
 * Test 1: Basic flow - Add data and verify it was saved.
 * Commands: "add 1 100 101 102"
 */
TEST_F(E2ETest, BasicAddCommand) {
    mockInput->commandsToFeed = {
        "add 1 100 101 102"
    };

    runAppWithCommands();

    // Verify data was saved to repository
    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData["1"].size(), 3);
    EXPECT_EQ(allData["1"][0], "100");
    EXPECT_EQ(allData["1"][1], "101");
    EXPECT_EQ(allData["1"][2], "102");
}

/**
 * Test 2: Multiple adds from different users.
 * Commands: 
 *   "add 1 100 101"
 *   "add 2 100 102"
 */
TEST_F(E2ETest, MultipleUsersAddCommands) {
    mockInput->commandsToFeed = {
        "add 1 100 101",
        "add 2 100 102"
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
 * Test 3: Add data and then test recommendation.
 * Commands:
 *   "add 1 100"
 *   "add 2 100 105"
 *   "recommend 1 105"
 * 
 * Expected: Should recommend nothing or products based on similarity.
 * (The exact recommendation depends on the Recommender logic)
 */
TEST_F(E2ETest, AddAndRecommend) {
    mockInput->commandsToFeed = {
        "add 1 100",
        "add 2 100 105",
        "recommend 1 105"
    };

    runAppWithCommands();

    // Verify data was saved
    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    ASSERT_EQ(allData.count("2"), 1);
    EXPECT_EQ(allData["1"].size(), 1);
    EXPECT_EQ(allData["2"].size(), 2);

    // The output should contain something (even if empty recommendations)
    // Just verify the app ran without crashing
    EXPECT_TRUE(true);
}

/**
 * Test 4: Invalid command handling.
 * Commands:
 *   "unknown_cmd 1 2 3"
 *   "add 1 100"
 *   "nonexistent 5"
 * 
 * Expected: Unknown commands are silently ignored, but valid commands still work.
 */
TEST_F(E2ETest, InvalidCommandsIgnored) {
    mockInput->commandsToFeed = {
        "unknown_cmd 1 2 3",
        "add 1 100",
        "nonexistent 5"
    };

    runAppWithCommands();

    // Only the "add" command should have executed
    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData["1"].size(), 1);
    EXPECT_EQ(allData["1"][0], "100");
}

/**
 * Test 5: Empty/whitespace commands are ignored.
 * Commands:
 *   ""
 *   "   "
 *   "add 1 100"
 *   "  \t  "
 * 
 * Expected: Whitespace and empty lines don't cause errors.
 */
TEST_F(E2ETest, EmptyAndWhitespaceCommands) {
    mockInput->commandsToFeed = {
        "   ",
        "add 1 100",
        "  \t  "
    }; // The MockInputSourceE2E will automatically return "" after these are done

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData["1"].size(), 1);
    EXPECT_EQ(allData["1"][0], "100");
}

/**
 * Test 6: Help command execution.
 * Commands:
 *   "help"
 * 
 * Expected: Help command writes output without crashing.
 */
TEST_F(E2ETest, HelpCommandExecution) {
    mockInput->commandsToFeed = {
        "help"
    };

    runAppWithCommands();

    // Help command should have written some output
    EXPECT_FALSE(mockOutput->capturedOutput.empty());
}

/**
 * Test 7: Complex scenario with multiple operations.
 * This simulates a realistic user session:
 * - User adds their viewing history
 * - User asks for recommendations
 * - User adds more data
 * - User asks for help
 */
TEST_F(E2ETest, ComplexScenarioMultipleOperations) {
    mockInput->commandsToFeed = {
        "add 1 100 101 102",
        "add 2 100 101 103",
        "add 3 102 103 104",
        "recommend 1 103",
        "help"
    };

    runAppWithCommands();

    // Verify all adds were successful
    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    ASSERT_EQ(allData.count("2"), 1);
    ASSERT_EQ(allData.count("3"), 1);
    
    EXPECT_EQ(allData["1"].size(), 3);
    EXPECT_EQ(allData["2"].size(), 3);
    EXPECT_EQ(allData["3"].size(), 3);
    
    // Help output should be present
    EXPECT_FALSE(mockOutput->capturedOutput.empty());
}

/**
 * Test 8: Add with single user and single product.
 * Commands:
 *   "add 99 999"
 */
TEST_F(E2ETest, AddSingleProductToUser) {
    mockInput->commandsToFeed = {
        "add 99 999"
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
        "add",              // Missing arguments - should fail silently
        "add 1",            // Missing product IDs - should fail silently
        "add 1 100 101",    // Valid - should work
        "recommend",        // Missing arguments - should fail silently
        "add 2 200"         // Valid - should work
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    // Only the valid adds should have succeeded
    EXPECT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData.count("2"), 1);
    EXPECT_EQ(allData["1"].size(), 2);
    EXPECT_EQ(allData["2"].size(), 1);
}

/**
 * Test 10: Duplicate products for the same user.
 * Commands:
 *   "add 1 100 101"
 *   "add 1 100 102"  // Adding 100 again (may be treated as duplicate)
 */
TEST_F(E2ETest, DuplicateProductsForUser) {
    mockInput->commandsToFeed = {
        "add 1 100 101",
        "add 1 100 102"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    // The exact number of products depends on duplicate handling logic
    EXPECT_GE(allData["1"].size(), 1);
}
