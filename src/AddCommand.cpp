#include "AddCommand.hpp"
#include <vector>
#include <string>
#include <algorithm>

AddCommand::AddCommand(IDataRepository& repository) : repo(repository) {}

void AddCommand::execute(const std::vector<std::string>& args) {
    // A valid command must contain at least a userId and one productId
    if (args.size() < 2) {
        return; // Ignore invalid commands as per requirements
    }

    std::string userId = args[0];
    std::vector<std::string> productsToSave;
    
    // Assuming IDataRepository provides a method to get existing user views
    std::vector<std::string> existingViews = repo.getUserViews(userId); 
    
    // Collect all new product IDs starting from the second argument
    for (size_t i = 1; i < args.size(); ++i) {
        const std::string& productId = args[i];
        
        bool alreadyInRepo = std::find(existingViews.begin(), existingViews.end(), productId) != existingViews.end();
        bool alreadyInNewList = std::find(productsToSave.begin(), productsToSave.end(), productId) != productsToSave.end();
        
        if (!alreadyInRepo && !alreadyInNewList) {
            productsToSave.push_back(productId);
        }
    }

    // Save the interactions only if there are new products to add
    if (!productsToSave.empty()) {
        repo.saveUserViews(userId, productsToSave);
    }
}