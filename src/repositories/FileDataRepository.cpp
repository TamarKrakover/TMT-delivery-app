#include "FileDataRepository.hpp"
#include <fstream>
#include <sstream>
#include <algorithm>

using namespace std;

FileDataRepository::FileDataRepository(string path) : filePath(move(path)) {}

// Appends new products to a user's history and instantly saves to the file
void FileDataRepository::saveUserViews(const string& userId, const vector<string>& productIds) {
    auto& userProds = userInteractions[userId];
    bool hasChanges = false;

    for (const auto& productId : productIds) {
        // check if the product does not exist in the user's history
        if (find(userProds.begin(), userProds.end(), productId) == userProds.end()) {
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
    ifstream inFile(filePath);
    if (!inFile) return false; // File doesn't exist yet

    userInteractions.clear();
    string line;

    while (getline(inFile, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string userId;
        ss >> userId;
        string productId;
        while (ss >> productId) {
            userInteractions[userId].push_back(productId);
        }
    }
    return true;
}

map<string, vector<string>> FileDataRepository::getAllData() const {
    // copy the naturally sorted map into a standard map for the interface return type
    map<string, vector<string>> standardMap(userInteractions.begin(), userInteractions.end());
    return standardMap;
}

vector<string> FileDataRepository::getUserViews(const string& userId) const {
    auto it = userInteractions.find(userId);
    if (it != userInteractions.end()) {
        return it->second;
    }
    return {}; 
}

// Overwrites the entire file with the current in-memory data
void FileDataRepository::persistToFile() const {
    // ios::trunc ensures we overwrite the file, creating it if it doesn't exist
    ofstream outFile(filePath, ios::trunc);
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
bool FileDataRepository::userExists(const string& userId) const {  
    return userInteractions.find(userId) != userInteractions.end();
}

// Removes specific products from a user's history and saves to file if changed
void FileDataRepository::removeUserViews(const string& userId, const vector<string>& productIds) {
    auto it = userInteractions.find(userId);

    // If the user does not exist, there is nothing to remove
    if (it == userInteractions.end()) {
        return;
    }
    bool hasChanges = false;
    vector<string>& userProds = it->second;

    // Iterate through all the product IDs the user wants to delete
    for (const auto& productId : productIds) {
        // Find if the product actually exists in the user's viewing history
        auto prodIt = find(userProds.begin(), userProds.end(), productId);
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