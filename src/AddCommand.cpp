#include "AddCommand.hpp"
#include <vector>
#include <string>

AddCommand::AddCommand(IDataRepository& repository) : repo(repository) {}

void AddCommand::execute(const std::vector<std::string>& args) {
    // A valid command must contain at least a userId and one productId
    if (args.size() < 2) {
        return; // Ignore invalid commands as per requirements
    }

    std::string userId = args[0];
    std::vector<std::string> products;
    
    // Collect all product IDs starting from the second argument
    for (size_t i = 1; i < args.size(); ++i) {
        products.push_back(args[i]);
    }

    // Save the interactions. FileDataRepository handles the actual file I/O.
    repo.saveUserViews(userId, products);
}