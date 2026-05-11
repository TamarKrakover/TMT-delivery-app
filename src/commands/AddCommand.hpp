#ifndef ADD_COMMAND_HPP
#define ADD_COMMAND_HPP

#include "ICommand.hpp"
#include "IDataRepository.hpp"

/**
 * AddCommand implements the 'add' logic.
 * It associates a user with a list of products they have viewed.
 */
class AddCommand : public ICommand {
public:
    explicit AddCommand(IDataRepository& repository);
    std::string getHelpText() const override;
    
    /**
     * Executes the add operation.
     * @param args A vector where args[0] is userId and the rest are productIds.
     */
    void execute(const std::vector<std::string>& args) override;

private:
    IDataRepository& repo;
};

#endif