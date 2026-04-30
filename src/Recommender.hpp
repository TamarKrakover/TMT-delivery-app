#ifndef RECOMMENDER_HPP
#define RECOMMENDER_HPP

#include "IDataRepository.hpp"
#include <string>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <unordered_set>

class Recommender {
private:
    IDataRepository& repo;

    int calculateSimilarity(const std::string& userA, const std::string& userB) const;

    // Helper function to check if a user watched a specific product
    bool hasWatchedTargetProduct(const std::vector<std::string>& history, const std::string& productId) const;

    std::vector<std::string> sortRecommendations(const std::unordered_map<std::string, int>& scores) const;

    int calculateSimilarity(const std::vector<std::string>& otherHistory, 
                            const std::unordered_set<std::string>& targetHistorySet) const;

public:
    // Constructor requires a repository reference
    explicit Recommender(IDataRepository& repository);

    // Main logic method
    std::vector<std::string> recommend(const std::string& userId, const std::string& productId);
};

#endif