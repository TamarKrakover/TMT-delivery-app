#include <gtest/gtest.h>
#include "Recommender.hpp"
#include "IDataRepository.hpp"
#include <string>
#include <vector>
#include <map>
#include <memory>
using namespace std;
// Fakes files for Testing
// Fake Repository to simulate data without relying on actual files
class FakeDataRepository : public IDataRepository {
private:
    map<string, vector<string>> fakeData;

public:
    // Helper method to inject specific test data
    void setFakeData(const map<string, vector<string>>& data) {
        fakeData = data;
    }

    // IDataRepository interface implementation
    void saveUserViews(const string& userId, const vector<string>& productIds) override {
        // Not needed for Recommender tests
    }

    vector<string> getUserViews(const string& userId) const override {
        
        return {};
    }
    
    bool loadAllData() override { 
        return true; 
    }

    map<string, vector<string>> getAllData() const override {
        return fakeData;
    }

    bool userExists(const string& userId) const override {
        return fakeData.find(userId) != fakeData.end();
    }

    void removeUserViews(const string& userId, const vector<string>& productIds) override {
        // Not needed for recommender tests, left empty
    }
};

// Test Fixture 

class RecommenderTest : public ::testing::Test {
protected:
    FakeDataRepository fakeRepo;
    unique_ptr<Recommender> recommender;

    // SetUp runs before each test
    void SetUp() override {
        recommender = make_unique<Recommender>(fakeRepo);
    }

    // TearDown runs after each test
    void TearDown() override {
    }
};

// Test Cases

// Test 1:  Verifies the basic logic of finding a similar user and recommending their product
TEST_F(RecommenderTest, BasicRecommendationReturnsCorrectProduct) {
    // Target User "1" watched product "104".
    // Other User "2" watched "104" AND "105".
    // We inject this scenario into our fake database.
    map<string, vector<string>> mockDatabase = {
        {"1", {"104"}},
        {"2", {"104", "105"}}
    };
    fakeRepo.setFakeData(mockDatabase);
    // Ask for recommendations for User "1" based on product "104"
    vector<string> results = recommender->recommend("1", "104");
    // We expect exactly one recommendation, and it should be "105"
    ASSERT_EQ(results.size(), 1);
    EXPECT_EQ(results[0], "105");
}

// Test 2:  Verifies the basic logic of finding a similar user and recommending their products, more than 1
TEST_F(RecommenderTest, BasicRecommendationReturns2Products) {
    // Target User "1" watched product "104".
    // Other User "2" watched "104","105","106".
    // We inject this scenario into our fake database.
    map<string, vector<string>> mockDatabase = {
        {"1", {"104"}},
        {"2", {"104", "105","106"}}
    };
    fakeRepo.setFakeData(mockDatabase);
    // Ask for recommendations for User "1" based on product "104"
    vector<string> results = recommender->recommend("1", "104");
    // We expect 2 recommendation, and it should be "105". "106"
    ASSERT_EQ(results.size(), 2);
    EXPECT_EQ(results[0], "105");
    EXPECT_EQ(results[1], "106");
}

// Test 3: Ensures no duplicate recommendations and basic scoring
TEST_F(RecommenderTest, NoDuplicatesAndScoring) {
    // Target User "1" watched "100".
    // User "2" watched "100" and "105".
    // User "3" watched "100" and "105" and "106".
    // "105" should be recommended by both, so it should have a higher score than "106".
    map<string, vector<string>> mockDatabase = {
        {"1", {"100"}},
        {"2", {"100", "105"}},
        {"3", {"100", "105", "106"}}
    };
    fakeRepo.setFakeData(mockDatabase);

    vector<string> results = recommender->recommend("1", "100");

    // We expect "105" to be the first recommendation because it has more "votes"
    ASSERT_FALSE(results.empty());
    EXPECT_EQ(results[0], "105");
    
    // Ensure "105" doesn't appear twice in the results
    int count105 = 0;
    for(const auto& res : results) {
        if(res == "105") count105++;
    }
    EXPECT_EQ(count105, 1);
}

// Test 4: Products from more similar users should rank higher
TEST_F(RecommenderTest, RanksByUserSimilarity) {
    // Target User "1" watched: "100", "101", "102"
    // User "2" (Weak similarity): watched "100" (target) and "999"
    // User "3" (Strong similarity): watched "100" (target), "101", "102" and "888"
    
    map<string, vector<string>> mockDatabase = {
        {"1", {"100", "101", "102"}},
        {"2", {"100", "999"}},
        {"3", {"100", "101", "102", "888"}}
    };
    fakeRepo.setFakeData(mockDatabase);

    vector<string> results = recommender->recommend("1", "100");

    ASSERT_GE(results.size(), 2);
    
    // "888" should come before "999" because User 3 is more similar to User 1
    // Similarity of User 3: 3 common items ("100", "101", "102")
    // Similarity of User 2: 1 common item ("100")
    EXPECT_EQ(results[0], "888");
    EXPECT_EQ(results[1], "999");
}

// Test 5: Non-existent user should return empty recommendations
TEST_F(RecommenderTest, NonExistentUserReturnsEmpty) {
    map<string, vector<string>> mockDatabase = {
        {"1", {"100", "101"}}
    };
    fakeRepo.setFakeData(mockDatabase);

    vector<string> results = recommender->recommend("999", "100");
    EXPECT_TRUE(results.empty());
}

// Test 6: User with no product history should return empty recommendations
TEST_F(RecommenderTest, UserWithNoHistoryReturnsEmpty) {
    map<string, vector<string>> mockDatabase = {
        {"1", {}}, // User exists but has no history
        {"2", {"100", "105"}}
    };
    fakeRepo.setFakeData(mockDatabase);

    vector<string> results = recommender->recommend("1", "100");
    EXPECT_TRUE(results.empty());
}

// Test 7: Recommendations should be capped at a maximum of 10 items
TEST_F(RecommenderTest, CapsRecommendationsAtTen) {
    // Target user watched product "0"
    // Other user watched "0" AND products "1" through "15"
    vector<string> targetHistory = {"0"};
    vector<string> otherHistory = {"0"};
    for(int i = 1; i <= 15; ++i) {
        otherHistory.push_back(to_string(i));
    }

    map<string, vector<string>> mockDatabase = {
        {"1", targetHistory},
        {"2", otherHistory}
    };
    fakeRepo.setFakeData(mockDatabase);

    vector<string> results = recommender->recommend("1", "0");
    
    // Even though 15 products are available, we only want the top 10
    EXPECT_EQ(results.size(), 10);
}
