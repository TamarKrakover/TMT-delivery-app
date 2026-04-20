/**
 * @file IDataRepository.hpp
 * @brief Interface for data persistence and management.
 * * This interface abstracts the data storage logic. It provides methods to save
 * and retrieve user-product interactions. By using this interface, the system
 * remains independent of the specific storage implementation (e.g., File System or Database).
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
};

#endif