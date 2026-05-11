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
class MockInputSource : public IInputSource {
public:
    std::vector<std::string> inputsToFeed;
    size_t currentIndex = 0;

    std::string readNextLine() override {
        if (currentIndex < inputsToFeed.size()) {
            return inputsToFeed[currentIndex++];
        }
        return ""; 
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
    
    void SetUp() override {
        mockInput = std::make_shared<MockInputSource>();
        mockOutput = std::make_shared<MockOutputWriter>();
        fakeRepo = std::make_unique<FakeRepo>();
        recommender = std::make_unique<Recommender>(*fakeRepo);
    }
};

TEST_F(AppTest, ParsesAndExecutesValidCommand) {
    mockInput->inputsToFeed = {"add 1 100 101"};
    
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    EXPECT_NO_THROW(app.run()); 
    
    ASSERT_EQ(fakeRepo->data.count("1"), 1);
    EXPECT_EQ(fakeRepo->data["1"].size(), 2);
}

TEST_F(AppTest, IgnoresUnknownCommand) {
    mockInput->inputsToFeed = {"delete 1 100"};
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    EXPECT_NO_THROW(app.run());
    EXPECT_EQ(mockOutput->capturedOutput, "400 Bad Request");
}

TEST_F(AppTest, HandlesEmptyInput) {
    mockInput->inputsToFeed = {"   ", ""};
    App app(mockInput, mockOutput, *fakeRepo, *recommender);
    
    EXPECT_NO_THROW(app.run());
    EXPECT_TRUE(fakeRepo->data.empty());
}