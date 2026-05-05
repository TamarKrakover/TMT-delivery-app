#include "FileDataRepository.hpp"
#include <fstream>
#include <sstream>

FileDataRepository::FileDataRepository(std::string path) : filePath(std::move(path)) {}

// appends new products to a user's history and instantly saves to the file
void FileDataRepository::saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) {
    auto& userProds = userInteractions[userId];
    userProds.insert(userProds.end(), productIds.begin(), productIds.end());
    persistToFile();
}

std::vector<std::string> FileDataRepository::getUserViews(const std::string& userId) const {
        auto it = userInteractions.find(userId);
        if (it != userInteractions.end()) {
            return it->second;
        }
        return {}; 
    }

// loads all user product interactions from the file into memory
bool FileDataRepository::loadAllData() {
    std::ifstream inFile(filePath);
    if (!inFile) return false; // file doesn't exist yet

    userInteractions.clear();
    std::string line;

    // parses lines in the format
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

// returns the in memory map of all data
std::map<std::string, std::vector<std::string>> FileDataRepository::getAllData() const {
    return userInteractions;
}

// overwrites the entire file with the current in memory data
void FileDataRepository::persistToFile() const {
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