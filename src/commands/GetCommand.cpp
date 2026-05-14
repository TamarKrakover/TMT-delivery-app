#include "GetCommand.hpp"
#include "Exceptions.hpp"
#include <algorithm>

GetCommand::GetCommand(IDataRepository& repo, Recommender& recommender, IOutputWriter& writer)
    : repository(repo), engine(recommender), outputWriter(writer) {}

void GetCommand::execute(const std::vector<std::string>& args) {
    // GET command must have 2 arguments
    if (args.size() != 2) {
        throw InvalidArgumentsException();
    }

    std::string userId = args[0];
    std::string productId = args[1];

    if(!repository.userExists(userId)) {
        throw UserNotFoundException();
    }

    // Check if the target product actually exists in the user's history
    std::vector<std::string> userHistory = repository.getUserViews(userId);
    if (std::find(userHistory.begin(), userHistory.end(), productId) == userHistory.end()) {
        throw ProductNotFoundException();
    }

    // Get recommendations from the engine
    std::vector<std::string> results = engine.recommend(userId, productId);

    // Build the output string according to the exact format required (200 Ok + double newline)
    std::string output = "200 Ok\n\n";

    // Append the space-separated recommendations
    for (size_t i = 0; i < results.size(); ++i) {
        output += results[i];
        if (i < results.size() - 1) {
            output += " ";
        }
    }
    
    // Add the final newline
    output += "\n";
    
    outputWriter.write(output);
}

// return the command's identifier
std::string GetCommand::getHelpText() const {
    return "GET, arguments: [userid] [productid]";
}