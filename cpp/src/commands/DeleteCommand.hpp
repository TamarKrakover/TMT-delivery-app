#ifndef DELETE_COMMAND_HPP
#define DELETE_COMMAND_HPP

#include "ICommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"

using namespace std;
/**
 * @class DeleteCommand
 * @brief Implements the 'DELETE' logic.
 * Removes specified product views from a user's history.
 */
class DeleteCommand : public ICommand {
public:
    // Constructor injects repository and output writer dependencies
    DeleteCommand(IDataRepository& repository, IOutputWriter& writer);

    // Executes the delete operation
    void execute(const vector<string>& args) override;
    string getHelpText() const override;

private:
    IDataRepository& repo;
    IOutputWriter& outputWriter;
};

#endif