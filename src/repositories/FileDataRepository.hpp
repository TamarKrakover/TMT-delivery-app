#ifndef FILEDATA_REPOSITORY_HPP
#define FILEDATA_REPOSITORY_HPP

#include "IDataRepository.hpp"
#include <map>
#include <vector>
#include <string>

// implementation of IDataRepository using local file storage
class FileDataRepository : public IDataRepository {
public:
    // initializes the repository with the storage file path
    explicit FileDataRepository(std::string path);
    ~FileDataRepository() override = default;

    // adds new interactions to memory and persists them to the file
    void saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) override;

    // returns the products a specific user has already viewed
    std::vector<std::string> getUserViews(const std::string& userId) const override;
    // loads all data from the file into the userInteractions map
    bool loadAllData() override;
    // returns the current in memory dataset
    std::map<std::string, std::vector<std::string>> getAllData() const override;

private:
    std::string filePath; // path to the data storage file
    std::map<std::string, std::vector<std::string>> userInteractions; // in memory cache of user data

    // internal helper to write the current map state to the file
    void persistToFile() const;
};

#endif