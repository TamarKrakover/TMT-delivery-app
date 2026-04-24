#ifndef FILEDATA_REPOSITORY_HPP
#define FILEDATA_REPOSITORY_HPP

#include "IDataRepository.hpp"
#include <map>
#include <vector>
#include <string>

class FileDataRepository : public IDataRepository {
public:
    explicit FileDataRepository(std::string path);
    ~FileDataRepository() override = default;

    void saveUserViews(const std::string& userId, const std::vector<std::string>& productIds) override;
    bool loadAllData() override;
    std::map<std::string, std::vector<std::string>> getAllData() const override;

private:
    std::string filePath;
    std::map<std::string, std::vector<std::string>> userInteractions;
    void persistToFile() const;
};

#endif