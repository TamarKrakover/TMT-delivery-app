#include "FileDataRepository.hpp"
#include <fstream>
#include <sstream>
#include <algorithm>

FileDataRepository::FileDataRepository(std::string path) : filePath(std::move(path)) {}

// Appends new products to a user's history and instantly saves to the file
void FileDataRepository::saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) {

    auto& userProds = userInteractions[userId];
    bool hasChanges = false;

    for (const auto& productId : productIds) {
        // check if the product does not exist in the user's history
        if (std::find(userProds.begin(), userProds.end(), productId) == userProds.end()) {
            userProds.push_back(productId);
            hasChanges = true;
        }
    }

    // only hit the disk if there's actually something new to write
    if (hasChanges) {
        persistToFile();
    }
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

// Checks if the user exists by searching the map
bool FileDataRepository::userExists(const std::string& userId) const {  
    return userInteractions.find(userId) != userInteractions.end();
}

// Removes specific products from a user's history and saves to file if changed
void FileDataRepository::removeUserViews(const std::string& userId, const std::vector<std::string>& productIds) {
    auto it = userInteractions.find(userId);

    // If the user does not exist, there is nothing to remove
    if (it == userInteractions.end()) {
        return;
    }
    bool hasChanges = false;
    std::vector<std::string>& userProds = it->second;

    // Iterate through all the product IDs the user wants to delete
    for (const auto& productId : productIds) {
        // Find if the product actually exists in the user's viewing history
        auto prodIt = std::find(userProds.begin(), userProds.end(), productId);
        if (prodIt != userProds.end()) {
            // Remove the product and mark that a change occurred
            userProds.erase(prodIt);
            hasChanges = true;
        }
    }
    // Only rewrite the file to disk if we actually deleted something
    if (hasChanges) {
        persistToFile();
    }
}