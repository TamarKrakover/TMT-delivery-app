#include "DeleteCommand.hpp"
#include "Exceptions.hpp"
#include <vector>
#include <string>
#include <algorithm>


DeleteCommand::DeleteCommand(IDataRepository& repository, IOutputWriter& writer)
    : repo(repository), outputWriter(writer) {}

void DeleteCommand::execute(const std::vector<std::string>& args) {
    // Command must have at least a userId and one productId
    if (args.size() < 2) {
        throw InvalidArgumentsException();
    }

    
    std::string userId = args[0];

    // Check if user exists. If not, throw 404 (which App will catch)
    if (!repo.userExists(userId)) {
        throw UserNotFoundException();
    }

    // Extract all products to delete (skipping the userId at index 0)
    std::vector<std::string> productsToDelete(args.begin() + 1, args.end());

    // Verify all products exist before deleting anything
    std::vector<std::string> userHistory = repo.getUserViews(userId);
    
    for (size_t i = 0; i < productsToDelete.size(); ++i) {
        const std::string& pid = productsToDelete[i];
        if (std::find(userHistory.begin(), userHistory.end(), pid) == userHistory.end()) {
            // Product not found in user's history, Logical error -> 404
            throw ProductNotFoundException(); 
        }
    }

    // Pass the list to the repository to handle the actual data manipulation
    repo.removeUserViews(userId, productsToDelete);

    // If everything succeeded, output the 204 response
    outputWriter.write("204 No Content\n");
}

std::string DeleteCommand::getHelpText() const {
    return "delete <user_id> <product_id> [product_id...] - Deletes products from a user's view history";
}