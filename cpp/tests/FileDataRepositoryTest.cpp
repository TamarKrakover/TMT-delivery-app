#include <gtest/gtest.h>
#include "FileDataRepository.hpp"
#include <fstream>
#include <vector>
#include <string>
using namespace std;
// Test suite for FileDataRepository
class FileDataRepositoryTest : public ::testing::Test {
protected:
    string testFileName = "test_data.txt";

    // Clean up the test file before and after each test
    void SetUp() override {
        remove(testFileName.c_str());
    }

    void TearDown() override {
        remove(testFileName.c_str());
    }
};

// 1. Test saving and retrieving data
TEST_F(FileDataRepositoryTest, SaveAndGetAllData) {
    FileDataRepository repo(testFileName);
    string userId = "1";
    vector<string> products = {"100", "101"};

    repo.saveUserViews(userId, products);
    auto data = repo.getAllData();

    ASSERT_EQ(data.size(), 1);
    EXPECT_EQ(data[userId], products);
}

// 2. Test data persistence (writing to file and loading back)
TEST_F(FileDataRepositoryTest, PersistenceTest) {
    {
        FileDataRepository repo(testFileName);
        repo.saveUserViews("1", {"100"});
    } // repo goes out of scope and should have persisted to file

    FileDataRepository newRepo(testFileName);
    ASSERT_TRUE(newRepo.loadAllData());
    
    auto data = newRepo.getAllData();
    ASSERT_EQ(data.size(), 1);
    EXPECT_EQ(data["1"].at(0), "100");
}

// 3. Test appending products to an existing user
TEST_F(FileDataRepositoryTest, AppendProductsTest) {
    FileDataRepository repo(testFileName);
    repo.saveUserViews("1", {"100"});
    repo.saveUserViews("1", {"101"});

    auto data = repo.getAllData();
    vector<string> expected = {"100", "101"};
    EXPECT_EQ(data["1"], expected);
}