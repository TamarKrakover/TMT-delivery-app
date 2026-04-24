#include "FileDataRepository.hpp"
#include <fstream>
#include <sstream>

FileDataRepository::FileDataRepository(std::string path) : filePath(std::move(path)) {}

void FileDataRepository::saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) {
    auto& userProds = userInteractions[userId];
    userProds.insert(userProds.end(), productIds.begin(), productIds.end());
    persistToFile();
}

bool FileDataRepository::loadAllData() {
    std::ifstream inFile(filePath);
    if (!inFile) return false;

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