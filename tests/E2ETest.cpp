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

class MockInputSourceE2E : public IInputSource {
public:
    std::vector<std::string> commandsToFeed;
    size_t currentIndex = 0;

    std::string readNextLine() override {
        if (currentIndex < commandsToFeed.size()) {
            return commandsToFeed[currentIndex++];
        }
        return ""; 
    }
};

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

class E2ETest : public ::testing::Test {
protected:
    std::string testDataFile = "e2e_test_data.txt";
    std::shared_ptr<MockInputSourceE2E> mockInput;
    std::shared_ptr<MockOutputWriterE2E> mockOutput;
    std::unique_ptr<FileDataRepository> repository;

    void SetUp() override {
        std::remove(testDataFile.c_str());
        
        mockInput = std::make_shared<MockInputSourceE2E>();
        mockOutput = std::make_shared<MockOutputWriterE2E>();
        
        repository = std::make_unique<FileDataRepository>(testDataFile);
        repository->loadAllData();
    }

    void TearDown() override {
        std::remove(testDataFile.c_str());
    }

    void runAppWithCommands() {
        Recommender recommender(*repository);
        App app(mockInput, mockOutput, *repository, recommender);
        EXPECT_NO_THROW(app.run());
    }
};

TEST_F(E2ETest, BasicAddCommand) {
    mockInput->commandsToFeed = {
        "add 1 100 101 102"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData["1"].size(), 3);
    EXPECT_EQ(allData["1"][0], "100");
    EXPECT_EQ(allData["1"][1], "101");
    EXPECT_EQ(allData["1"][2], "102");
}

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

TEST_F(E2ETest, AddAndRecommend) {
    mockInput->commandsToFeed = {
        "add 1 100",
        "add 2 100 105",
        "recommend 1 105"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    ASSERT_EQ(allData.count("2"), 1);
    EXPECT_EQ(allData["1"].size(), 1);
    EXPECT_EQ(allData["2"].size(), 2);
}

TEST_F(E2ETest, InvalidCommandsIgnored) {
    mockInput->commandsToFeed = {
        "unknown_cmd 1 2 3",
        "add 1 100",
        "nonexistent 5"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData["1"].size(), 1);
    EXPECT_EQ(allData["1"][0], "100");
}

TEST_F(E2ETest, EmptyAndWhitespaceCommands) {
    mockInput->commandsToFeed = {
        "   ",
        "add 1 100",
        "  \t  "
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData["1"].size(), 1);
    EXPECT_EQ(allData["1"][0], "100");
}

TEST_F(E2ETest, HelpCommandExecution) {
    mockInput->commandsToFeed = {
        "help"
    };

    runAppWithCommands();

    EXPECT_FALSE(mockOutput->capturedOutput.empty());
}

TEST_F(E2ETest, ComplexScenarioMultipleOperations) {
    mockInput->commandsToFeed = {
        "add 1 100 101 102",
        "add 2 100 101 103",
        "add 3 102 103 104",
        "recommend 1 103",
        "help"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    ASSERT_EQ(allData.count("2"), 1);
    ASSERT_EQ(allData.count("3"), 1);
    
    EXPECT_EQ(allData["1"].size(), 3);
    EXPECT_EQ(allData["2"].size(), 3);
    EXPECT_EQ(allData["3"].size(), 3);
    
    EXPECT_FALSE(mockOutput->capturedOutput.empty());
}

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

TEST_F(E2ETest, MixedValidAndInvalidCommands) {
    mockInput->commandsToFeed = {
        "add",              
        "add 1",            
        "add 1 100 101",    
        "recommend",        
        "add 2 200"         
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    EXPECT_EQ(allData.count("1"), 1);
    EXPECT_EQ(allData.count("2"), 1);
    EXPECT_EQ(allData["1"].size(), 2);
    EXPECT_EQ(allData["2"].size(), 1);
}

TEST_F(E2ETest, DuplicateProductsForUser) {
    mockInput->commandsToFeed = {
        "add 1 100 101",
        "add 1 100 102"
    };

    runAppWithCommands();

    auto allData = repository->getAllData();
    ASSERT_EQ(allData.count("1"), 1);
    EXPECT_GE(allData["1"].size(), 1);
}