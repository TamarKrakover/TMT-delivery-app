#include "PostCommand.hpp"
#include "Exceptions.hpp"
#include <vector>
#include <string>

using namespace std;

// constructor
PostCommand::PostCommand(IDataRepository& repository, IOutputWriter& writer)
    : repo(repository), outputWriter(writer) {}

void PostCommand::execute(const vector<string>& args) {
   // check that we have at least a user ID and one product ID
    if (args.size() < 2) {
        throw InvalidArgumentsException();
    }
    
    string userId = args[0];

    // check if the user already exists, POST is only valid for new users
    if (repo.userExists(userId)) {
        throw UserAlreadyExistsException();
    }

    // create a vector that holds the product arguments
    vector<string> productsToSave(args.begin() + 1, args.end());

    // save the new user and their products
    repo.saveUserViews(userId, productsToSave);

    // return the success response
    outputWriter.write("201 Created\n");
}

// return the command's identifier
string PostCommand::getHelpText() const {
    return "POST, arguments: [userid] [productid]";
}