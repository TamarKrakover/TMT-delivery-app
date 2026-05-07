#include "Recommender.hpp"
#include <algorithm>
#include <cctype>
#include <string>
#include <map>

namespace {
    bool naturalCompare(const std::string& a, const std::string& b) {
        size_t i = 0, j = 0;
        while (i < a.length() && j < b.length()) {
            if (std::isdigit(a[i]) && std::isdigit(b[j])) {
                size_t startA = i, startB = j;
                while (i < a.length() && std::isdigit(a[i])) i++;
                while (j < b.length() && std::isdigit(b[j])) j++;
                
                std::string numA = a.substr(startA, i - startA);
                std::string numB = b.substr(startB, j - startB);
                
                size_t nonZeroA = 0;
                while (nonZeroA < numA.length() - 1 && numA[nonZeroA] == '0') nonZeroA++;
                numA = numA.substr(nonZeroA);
                
                size_t nonZeroB = 0;
                while (nonZeroB < numB.length() - 1 && numB[nonZeroB] == '0') nonZeroB++;
                numB = numB.substr(nonZeroB);
                
                if (numA.length() != numB.length()) {
                    return numA.length() < numB.length();
                }
                if (numA != numB) {
                    return numA < numB;
                }
            } else {
                if (a[i] != b[j]) {
                    if (std::isdigit(a[i]) && !std::isdigit(b[j])) return true;
                    if (!std::isdigit(a[i]) && std::isdigit(b[j])) return false;
                    return a[i] < b[j];
                }
                i++;
                j++;
            }
        }
        return a.length() < b.length();
    }
}

Recommender::Recommender(IDataRepository& dataRepository) : repo(dataRepository) {}

bool Recommender::hasWatchedTargetProduct(const std::vector<std::string>& history, const std::string& productId) const {
    for (size_t i = 0; i < history.size(); ++i) {
        if (history[i] == productId) {
            return true;
        }
    }
    return false;
}

std::vector<std::string> Recommender::sortRecommendations(const std::unordered_map<std::string, int>& scores) const {
    std::vector<std::pair<std::string, int> > productPairs;
    for (std::unordered_map<std::string, int>::const_iterator it = scores.begin(); it != scores.end(); ++it) {
        productPairs.push_back(*it);
    }

    std::sort(productPairs.begin(), productPairs.end(), [](const std::pair<std::string, int>& a, const std::pair<std::string, int>& b) {
        if (a.second != b.second) {
            return a.second > b.second; 
        }
        return naturalCompare(a.first, b.first); 
    });

    std::vector<std::string> sortedIds;
    for (size_t i = 0; i < productPairs.size() && i < 10; ++i) {
        sortedIds.push_back(productPairs[i].first);
    }

    return sortedIds;
}

int Recommender::calculateSimilarity(const std::vector<std::string>& otherHistory, 
                                     const std::unordered_set<std::string>& targetHistorySet) const {
    int similarity = 0;
    for (size_t i = 0; i < otherHistory.size(); ++i) {
        if (targetHistorySet.count(otherHistory[i]) > 0) {
            similarity++;
        }
    }
    return similarity;
}

std::vector<std::string> Recommender::recommend(const std::string& userId, const std::string& productId) {
    // Fixed: Changed type to std::map to match the repository's return type
    std::map<std::string, std::vector<std::string> > allData = repo.getAllData();
    
    if (allData.find(userId) == allData.end()) return std::vector<std::string>();

    const std::vector<std::string>& targetVector = allData[userId];
    std::unordered_set<std::string> targetHistorySet(targetVector.begin(), targetVector.end());

    std::unordered_map<std::string, int> scores;

    // Fixed: Using std::map iterator
    for (std::map<std::string, std::vector<std::string> >::const_iterator it = allData.begin(); it != allData.end(); ++it) {
        const std::string& otherUserId = it->first;
        const std::vector<std::string>& otherHistory = it->second;

        if (otherUserId == userId) continue;

        if (hasWatchedTargetProduct(otherHistory, productId)) {
            int weight = calculateSimilarity(otherHistory, targetHistorySet);
            if (weight > 0) {
                for (size_t i = 0; i < otherHistory.size(); ++i) {
                    const std::string& item = otherHistory[i];
                    if (item != productId && targetHistorySet.count(item) == 0) {
                        scores[item] += weight;
                    }
                }
            }
        }
    }

    return sortRecommendations(scores);
}