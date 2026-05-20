#include "GetCommand.hpp"
#include "Exceptions.hpp"
#include <algorithm>
using namespace std;

GetCommand::GetCommand(IDataRepository& repo, Recommender& recommender, IOutputWriter& writer)
    : repository(repo), engine(recommender), outputWriter(writer) {}

void GetCommand::execute(const vector<string>& args) {
    // GET command must have 2 arguments
    if (args.size() != 2) {
        throw InvalidArgumentsException();
    }

    string userId = args[0];
    string productId = args[1];

    if(!repository.userExists(userId)) {
        throw UserNotFoundException();
    }

    // Get recommendations from the engine
    vector<string> results = engine.recommend(userId, productId);

    // Build the output string according to the exact format required (200 Ok + double newline)
    string output = "200 Ok\n\n";

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
string GetCommand::getHelpText() const {
    return "GET, arguments: [userid] [productid]";
}