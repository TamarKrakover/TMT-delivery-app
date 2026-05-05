/**
 * @file IDataRepository.hpp
 * @brief Interface for data persistence and management.
 */
#ifndef IDATA_REPOSITORY_HPP
#define IDATA_REPOSITORY_HPP

#include <string>
#include <vector>
#include <map>

class IDataRepository {
public:
    virtual ~IDataRepository() = default;

    virtual void saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) = 0;
    virtual bool loadAllData() = 0;
    virtual std::map<std::string, std::vector<std::string>> getAllData() const = 0;
    
    // Returns existing products for a specific user to help check for duplicates
    virtual std::vector<std::string> getUserViews(const std::string& userId) const = 0;
};

#endif