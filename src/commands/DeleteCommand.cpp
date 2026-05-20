#include "DeleteCommand.hpp"
#include "Exceptions.hpp"
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

DeleteCommand::DeleteCommand(IDataRepository& repository, IOutputWriter& writer)
    : repo(repository), outputWriter(writer) {}

void DeleteCommand::execute(const vector<string>& args) {
    // Command must have at least a userId and one productId
    if (args.size() < 2) {
        throw InvalidArgumentsException();
    }

    string userId = args[0];

    // Check if user exists. If not, throw 404 (which App will catch)
    if (!repo.userExists(userId)) {
        throw UserNotFoundException();
    }

    // Extract all products to delete (skipping the userId at index 0)
    vector<string> productsToDelete(args.begin() + 1, args.end());

    // Verify all products exist before deleting anything, and not duplicates
    vector<string> userHistory = repo.getUserViews(userId);
    
    for (size_t i = 0; i < productsToDelete.size(); ++i) {
        const string& pid = productsToDelete[i];

        auto it = find(userHistory.begin(), userHistory.end(), pid);

        if (it == userHistory.end()) {
            // Product not found, or duplicates in the requested list (same error)
            throw ProductNotFoundException(); 
        } else {
            //Remove the matched item from the temporary list
            userHistory.erase(it);
        }
    }

    // Pass the list to the repository to handle the actual data manipulation
    repo.removeUserViews(userId, productsToDelete);

    // If everything succeeded, output the 204 response
    outputWriter.write("204 No Content\n");
}

// return the command's identifier
string DeleteCommand::getHelpText() const {
    return "DELETE, arguments: [userid] [productid1] [productid2] ...";
}