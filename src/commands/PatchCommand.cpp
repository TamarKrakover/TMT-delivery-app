#include "PatchCommand.hpp"
#include "Exceptions.hpp"
#include <vector>
#include <string>

using namespace std;

// constructor
PatchCommand::PatchCommand(IDataRepository& repository, IOutputWriter& writer)
    : repo(repository), outputWriter(writer) {}

void PatchCommand::execute(const vector<string>& args) {
    // check that there are at least 2 arguments
    if (args.size() < 2) {
        throw InvalidArgumentsException();
    }

    string userId = args[0];

    // verify that the user already exists
    if (!repo.userExists(userId)) {
        throw UserNotFoundException();
    }

    // create a vector that holds the product arguments
    vector<string> productsToSave(args.begin() + 1, args.end());

    // add the products to the relevant user
    repo.saveUserViews(userId, productsToSave);

    // return the success response
    outputWriter.write("204 No Content\n");
}

// return the command's identifier
string PatchCommand::getHelpText() const {
    return "PATCH, arguments: [userid] [productid1] [productid2] ...";
}