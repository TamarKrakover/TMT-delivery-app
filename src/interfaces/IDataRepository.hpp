/**
 * @file IDataRepository.hpp
 * @brief Interface for data persistence and management.
 */
#ifndef IDATA_REPOSITORY_HPP
#define IDATA_REPOSITORY_HPP

#include <string>
#include <vector>
#include <map>
using namespace std;
class IDataRepository {
public:
    virtual ~IDataRepository() = default;

    virtual void saveUserViews(const string& userId, const vector<string>& productIds) = 0;
    virtual bool loadAllData() = 0;
    virtual map<string, vector<string>> getAllData() const = 0;
    
    // Returns existing products for a specific user to help check for duplicates
    virtual vector<string> getUserViews(const string& userId) const = 0;

    virtual bool userExists(const string& userId) const = 0;
    virtual void removeUserViews(const string& userId, const vector<string>& productIds) = 0;
};

#endif