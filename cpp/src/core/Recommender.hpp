#ifndef RECOMMENDER_HPP
#define RECOMMENDER_HPP

#include "IDataRepository.hpp"
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <unordered_set>
#include <cctype>
using namespace std;

class Recommender {
private:
    IDataRepository& repo;

    int calculateSimilarity(const string& userA, const string& userB) const;

    // Helper function to check if a user watched a specific product
    bool hasWatchedTargetProduct(const vector<string>& history, const string& productId) const;

    vector<string> sortRecommendations(const unordered_map<string, int>& scores) const;

    int calculateSimilarity(const vector<string>& otherHistory, 
                            const unordered_set<string>& targetHistorySet) const;

public:
    // Constructor requires a repository reference
    explicit Recommender(IDataRepository& repository);

    // Main logic method
    vector<string> recommend(const string& userId, const string& productId);
};

#endif