#include "Recommender.hpp"

// Constructor implementation
Recommender::Recommender(IDataRepository& dataRepository) : repo(dataRepository) {}

// Helper function to check if a user watched a specific product
bool Recommender::hasWatchedTargetProduct(const std::vector<std::string>& history, const std::string& productId) const {
    for (const auto& item : history) {
        if (item == productId) {
            return true;
        }
    }
    return false;
}

std::vector<std::string> Recommender::sortRecommendations(const std::unordered_map<std::string, int>& scores) const {
    // Transfer from map to vector of pairs to allow sorting
    std::vector<std::pair<std::string, int>> productPairs(scores.begin(), scores.end());

    // Sort: Primary key is score (descending), secondary key is product ID (ascending)
    std::sort(productPairs.begin(), productPairs.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second) {
            return a.second > b.second; 
        }
        return a.first < b.first; 
    });

    // Extract only the product IDs
    std::vector<std::string> sortedIds;
    // Limit to top 10 recommendations
    for (size_t i = 0; i < productPairs.size() && i < 10; ++i) {
        sortedIds.push_back(productPairs[i].first);
    }

    return sortedIds;
}

int Recommender::calculateSimilarity(const std::vector<std::string>& otherHistory, 
                                     const std::unordered_set<std::string>& targetHistorySet) const {
    int similarity = 0;
    for (const auto& item : otherHistory) {
        if (targetHistorySet.count(item) > 0) {
            similarity++;
        }
    }
    return similarity;
}

std::vector<std::string> Recommender::recommend(const std::string& userId, const std::string& productId) {
    auto allData = repo.getAllData();
    if (allData.find(userId) == allData.end()) return {};

    // Prepare target user's history as a set for O(1) lookup
    const auto& targetVector = allData[userId];
    std::unordered_set<std::string> targetHistorySet(targetVector.begin(), targetVector.end());

    std::unordered_map<std::string, int> scores;

    for (const auto& [otherUserId, otherHistory] : allData) {
        if (otherUserId == userId) continue;

        if (hasWatchedTargetProduct(otherHistory, productId)) {
            // Calculate how similar this user is to our target user
            int weight = calculateSimilarity(otherHistory, targetHistorySet);
                if (weight > 0) {
                    for (const auto& item : otherHistory) {
                            // Not the target product, and not something the user already saw
                            if (item != productId && targetHistorySet.count(item) == 0) {
                                scores[item] += weight; // Add the similarity weight instead of just +1
                            }
                    }
                }
            }
        }

    return sortRecommendations(scores);
}
