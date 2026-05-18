#include <gtest/gtest.h>
#include "Recommender.hpp"
#include "IDataRepository.hpp"
#include <string>
#include <vector>
#include <map>
#include <memory>

// fakes files for Testing
// fake Repository to simulate data without relying on actual files
class FakeDataRepository : public IDataRepository {
private:
    std::map<std::string, std::vector<std::string>> fakeData;

public:
    // helper method to inject specific test data
    void setFakeData(const std::map<std::string, std::vector<std::string>>& data) {
        fakeData = data;
    }

    // IDataRepository interface implementation
    void saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {
        // not needed for Recommender tests
    }

    std::vector<std::string> getUserViews(const std::string& userId) const override {
        
        return {};
    }
    
    bool loadAllData() override { 
        return true; 
    }

    std::map<std::string, std::vector<std::string>> getAllData() const override {
        return fakeData;
    }

    bool userExists(const std::string& userId) const override {
        return fakeData.find(userId) != fakeData.end();
    }

    void removeUserViews(const std::string& userId, const std::vector<std::string>& productIds) override {
        // not needed for recommender tests, left empty
    }
};

// Test Fixture 

class RecommenderTest : public ::testing::Test {
protected:
    FakeDataRepository fakeRepo;
    std::unique_ptr<Recommender> recommender;

    // setUp runs before each test
    void SetUp() override {
        recommender = std::make_unique<Recommender>(fakeRepo);
    }

    // tearDown runs after each test
    void TearDown() override {
    }
};

// Test Cases

// Test 1:  Verifies the basic logic of finding a similar user and recommending their product
TEST_F(RecommenderTest, BasicRecommendationReturnsCorrectProduct) {
    // target User "1" watched product "104".
    // other User "2" watched "104" AND "105".
    std::map<std::string, std::vector<std::string>> mockDatabase = {
        {"1", {"104"}},
        {"2", {"104", "105"}}
    };
    fakeRepo.setFakeData(mockDatabase);
    // ask for recommendations for User "1" based on product "104"
    std::vector<std::string> results = recommender->recommend("1", "104");
    // expect exactly one recommendation, and it should be "105"
    ASSERT_EQ(results.size(), 1);
    EXPECT_EQ(results[0], "105");
}

// Test 2:  Verifies the basic logic of finding a similar user and recommending their products, more than 1
TEST_F(RecommenderTest, BasicRecommendationReturns2Products) {
    // target User "1" watched product "104".
    // other User "2" watched "104","105","106".
    std::map<std::string, std::vector<std::string>> mockDatabase = {
        {"1", {"104"}},
        {"2", {"104", "105","106"}}
    };
    fakeRepo.setFakeData(mockDatabase);
    // ask for recommendations for User "1" based on product "104"
    std::vector<std::string> results = recommender->recommend("1", "104");
    // expect 2 recommendation, and it should be "105". "106"
    ASSERT_EQ(results.size(), 2);
    EXPECT_EQ(results[0], "105");
    EXPECT_EQ(results[1], "106");
}

// Test 3: Ensures no duplicate recommendations and basic scoring
TEST_F(RecommenderTest, NoDuplicatesAndScoring) {
    // target User "1" watched "100".
    // user "2" watched "100" and "105".
    // user "3" watched "100" and "105" and "106".
    // "105" should be recommended by both, so it should have a higher score than "106".
    std::map<std::string, std::vector<std::string>> mockDatabase = {
        {"1", {"100"}},
        {"2", {"100", "105"}},
        {"3", {"100", "105", "106"}}
    };
    fakeRepo.setFakeData(mockDatabase);

    std::vector<std::string> results = recommender->recommend("1", "100");

    // expect "105" to be the first recommendation because it has more "votes"
    ASSERT_FALSE(results.empty());
    EXPECT_EQ(results[0], "105");
    
    // ensure "105" doesn't appear twice in the results
    int count105 = 0;
    for(const auto& res : results) {
        if(res == "105") count105++;
    }
    EXPECT_EQ(count105, 1);
}

// Test 4: Products from more similar users should rank higher
TEST_F(RecommenderTest, RanksByUserSimilarity) {
    // target User "1" watched: "100", "101", "102"
    // user "2" (Weak similarity): watched "100" (target) and "999"
    // user "3" (Strong similarity): watched "100" (target), "101", "102" and "888"
    
    std::map<std::string, std::vector<std::string>> mockDatabase = {
        {"1", {"100", "101", "102"}},
        {"2", {"100", "999"}},
        {"3", {"100", "101", "102", "888"}}
    };
    fakeRepo.setFakeData(mockDatabase);

    std::vector<std::string> results = recommender->recommend("1", "100");

    ASSERT_GE(results.size(), 2);
    
    // "888" should come before "999" because User 3 is more similar to User 1
    // similarity of User 3: 3 common items ("100", "101", "102")
    // similarity of User 2: 1 common item ("100")
    EXPECT_EQ(results[0], "888");
    EXPECT_EQ(results[1], "999");
}

// Test 5: Non-existent user should return empty recommendations
TEST_F(RecommenderTest, NonExistentUserReturnsEmpty) {
    std::map<std::string, std::vector<std::string>> mockDatabase = {
        {"1", {"100", "101"}}
    };
    fakeRepo.setFakeData(mockDatabase);

    std::vector<std::string> results = recommender->recommend("999", "100");
    EXPECT_TRUE(results.empty());
}

// Test 6: User with no product history should return empty recommendations
TEST_F(RecommenderTest, UserWithNoHistoryReturnsEmpty) {
    std::map<std::string, std::vector<std::string>> mockDatabase = {
        {"1", {}}, // User exists but has no history
        {"2", {"100", "105"}}
    };
    fakeRepo.setFakeData(mockDatabase);

    std::vector<std::string> results = recommender->recommend("1", "100");
    EXPECT_TRUE(results.empty());
}

// Test 7: Recommendations should be capped at a maximum of 10 items
TEST_F(RecommenderTest, CapsRecommendationsAtTen) {
    // target user watched product "0"
    // other user watched "0" AND products "1" through "15"
    std::vector<std::string> targetHistory = {"0"};
    std::vector<std::string> otherHistory = {"0"};
    for(int i = 1; i <= 15; ++i) {
        otherHistory.push_back(std::to_string(i));
    }

    std::map<std::string, std::vector<std::string>> mockDatabase = {
        {"1", targetHistory},
        {"2", otherHistory}
    };
    fakeRepo.setFakeData(mockDatabase);

    std::vector<std::string> results = recommender->recommend("1", "0");
    
    // even though 15 products are available, only want the top 10
    EXPECT_EQ(results.size(), 10);
}