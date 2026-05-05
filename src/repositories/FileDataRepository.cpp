#include "FileDataRepository.hpp"
#include <fstream>
#include <sstream>
#include <algorithm>

FileDataRepository::FileDataRepository(std::string path) : filePath(std::move(path)) {}

// Appends new products to a user's history and instantly saves to the file
void FileDataRepository::saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) {
    auto& userProds = userInteractions[userId];
    userProds.insert(userProds.end(), productIds.begin(), productIds.end());
    persistToFile();
}

// Loads all user product interactions from the file into memory
bool FileDataRepository::loadAllData() {
    std::ifstream inFile(filePath);
    if (!inFile) return false; // File doesn't exist yet

    userInteractions.clear();
    std::string line;

    while (std::getline(inFile, line)) {
        if (line.empty()) continue;
        std::stringstream ss(line);
        std::string userId;
        ss >> userId;
        std::string productId;
        while (ss >> productId) {
            userInteractions[userId].push_back(productId);
        }
    }
    return true;
}

std::map<std::string, std::vector<std::string>> FileDataRepository::getAllData() const {
    return userInteractions;
}

std::vector<std::string> FileDataRepository::getUserViews(const std::string& userId) const {
    auto it = userInteractions.find(userId);
    if (it != userInteractions.end()) {
        return it->second;
    }
    return {}; 
}

// Overwrites the entire file with the current in-memory data
void FileDataRepository::persistToFile() const {
    // std::ios::trunc ensures we overwrite the file, creating it if it doesn't exist
    std::ofstream outFile(filePath, std::ios::trunc);
    if (!outFile) return;

    for (const auto& pair : userInteractions) {
        outFile << pair.first;
        for (const auto& productId : pair.second) {
            outFile << " " << productId;
        }
        outFile << "\n";
    }
}