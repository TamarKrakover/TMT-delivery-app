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

    // extract all products from the arguments (skipping the userId at index 0)
    std::vector<std::string> productsToSave(args.begin() + 1, args.end());
    
    // pass the raw list to the repository
    repo.saveUserViews(userId, productsToSave);
}