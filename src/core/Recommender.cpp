#include "Recommender.hpp"
#include "NaturalCompare.hpp"
#include <algorithm>
#include <cctype>
#include <string>
#include <map>

using namespace std;

// constructor: Initializes the recommender with the data repository
Recommender::Recommender(IDataRepository& dataRepository) : repo(dataRepository) {}

// checks if a user's history contains the target product
bool Recommender::hasWatchedTargetProduct(const vector<string>& history, const string& productId) const {
    for (size_t i = 0; i < history.size(); ++i) {
        if (history[i] == productId) {
            return true;
        }
    }
    return false;
}

// sorts recommendations by score, breaks ties via natural compare, and extracts top 10
vector<string> Recommender::sortRecommendations(const unordered_map<string, int>& scores) const {
    vector<pair<string, int>> productPairs;
    for (unordered_map<string, int>::const_iterator it = scores.begin(); it != scores.end(); ++it) {
        productPairs.push_back(*it);
    }

    // sort primary by score, secondary by natural product ID order
    sort(productPairs.begin(), productPairs.end(), [](const pair<string, int>& a, const pair<string, int>& b) {
        if (a.second != b.second) {
            return a.second > b.second; 
        }
        return NaturalCompare()(a.first, b.first); 
    });

    // get the top 10 product IDs
    vector<string> sortedIds;
    for (size_t i = 0; i < productPairs.size() && i < 10; ++i) {
        sortedIds.push_back(productPairs[i].first);
    }

    return sortedIds;
}

// calculates history overlap between another user and the target user
int Recommender::calculateSimilarity(const vector<string>& otherHistory, 
                                     const unordered_set<string>& targetHistorySet) const {
    int similarity = 0;
    for (size_t i = 0; i < otherHistory.size(); ++i) {
        if (targetHistorySet.count(otherHistory[i]) > 0) {
            similarity++;
        }
    }
    return similarity;
}

// generates recommendations using Collaborative Filtering
vector<string> Recommender::recommend(const string& userId, const string& productId) {
    map<string, vector<string>> allData = repo.getAllData();
    
    // return empty if target user is not found
    if (allData.find(userId) == allData.end()) return vector<string>();

    // store target history in a hash set
    const vector<string>& targetVector = allData[userId];
    unordered_set<string> targetHistorySet(targetVector.begin(), targetVector.end());

    unordered_map<string, int> scores;

    // iterate through all users to aggregate scores from similar profiles
    for (map<string, vector<string>>::const_iterator it = allData.begin(); it != allData.end(); ++it) {
        const string& otherUserId = it->first;
        const vector<string>& otherHistory = it->second;

        if (otherUserId == userId) continue;

        // process only users who have interacted with the target product
        if (hasWatchedTargetProduct(otherHistory, productId)) {
            int weight = calculateSimilarity(otherHistory, targetHistorySet);

            // accumulate weighted scores for unseen products
            if (weight > 0) {
                for (size_t i = 0; i < otherHistory.size(); ++i) {
                    const string& item = otherHistory[i];
                    // skip the target product itself and items the target user has already seen
                    if (item != productId && targetHistorySet.count(item) == 0) {
                        scores[item] += weight;
                    }
                }
            }
        }
    }

    return sortRecommendations(scores);
}