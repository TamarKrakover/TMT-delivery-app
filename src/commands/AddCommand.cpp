#include "AddCommand.hpp"
#include <vector>
#include <string>
#include <algorithm>

AddCommand::AddCommand(IDataRepository& repository) : repo(repository) {}

void AddCommand::execute(const std::vector<std::string>& args) {
    // A valid command must contain at least a userId and one productId
    if (args.size() < 2) {
        return; 
    }

    std::string userId = args[0];
    std::vector<std::string> productsToSave;
    
    // Fetch existing views for this user to avoid duplicates
    std::vector<std::string> existingViews = repo.getUserViews(userId); 
    
    for (size_t i = 1; i < args.size(); ++i) {
        const std::string& productId = args[i];
        
        // Check if the product is already in the repository
        bool alreadyInRepo = std::find(existingViews.begin(), existingViews.end(), productId) != existingViews.end();
        
        // Check if the product was already added earlier in this specific command (e.g., add user1 p1 p1)
        bool alreadyInNewList = std::find(productsToSave.begin(), productsToSave.end(), productId) != productsToSave.end();
        
        if (!alreadyInRepo && !alreadyInNewList) {
            productsToSave.push_back(productId);
        }
    }

    // Only hit the disk if there's actually something new to write
    if (!productsToSave.empty()) {
        repo.saveUserViews(userId, productsToSave);
    }
}