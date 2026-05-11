#ifndef GET_COMMAND_HPP
#define GET_COMMAND_HPP

#include "ICommand.hpp"
#include "IDataRepository.hpp"
#include "Recommender.hpp"
#include "IOutputWriter.hpp"

/**
 * @class GetCommand
 * @brief Implements the 'GET' logic (replacing the old 'recommend' command).
 * Validates the user and product, then delegates to the Recommender engine.
 */
class GetCommand : public ICommand {
public:
    // Injecting the repository for validation, recommender for logic, and output for display
    GetCommand(IDataRepository& repo, Recommender& recommender, IOutputWriter& writer);

    /**
     * Executes the recommendation process.
     * @param args Expected: [0] userId, [1] productId.
     */
    void execute(const std::vector<std::string>& args) override;

    std::string getHelpText() const override;

private:
    IDataRepository& repository;
    Recommender& engine;
    IOutputWriter& outputWriter;
};

#endif