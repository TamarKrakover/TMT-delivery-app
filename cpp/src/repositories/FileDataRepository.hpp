#ifndef FILEDATA_REPOSITORY_HPP
#define FILEDATA_REPOSITORY_HPP

#include "IDataRepository.hpp"
#include "NaturalCompare.hpp"
#include <map>
#include <vector>
#include <string>

using namespace std;

// implementation of IDataRepository using local file storage
class FileDataRepository : public IDataRepository {
public:
    // initializes the repository with the storage file path
    explicit FileDataRepository(string path);
    ~FileDataRepository() override = default;

    // adds new interactions to memory and persists them to the file
    void saveUserViews(const string& userId, const vector<string>& productIds) override;

    // returns the products a specific user has already viewed
    vector<string> getUserViews(const string& userId) const override;
    // loads all data from the file into the userInteractions map
    bool loadAllData() override;
    // returns the current in memory dataset
    map<string, vector<string>> getAllData() const override;
    bool userExists(const string& userId) const override;
    void removeUserViews(const string& userId, const vector<string>& productIds) override;

private:
    string filePath; // path to the data storage file
    
    // Updated the map template arguments to apply the custom natural sorting comparator
    map<string, vector<string>, NaturalCompare> userInteractions; 

    // internal helper to write the current map state to the file
    void persistToFile() const;
};

#endif