#ifndef DELETE_COMMAND_HPP
#define DELETE_COMMAND_HPP

#include "ICommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"

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
    void execute(const std::vector<std::string>& args) override;

private:
    IDataRepository& repo;
    IOutputWriter& outputWriter;
};

#endif