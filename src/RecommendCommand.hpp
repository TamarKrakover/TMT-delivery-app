#ifndef RECOMMEND_COMMAND_HPP
#define RECOMMEND_COMMAND_HPP

#include "ICommand.hpp"
#include "Recommender.hpp"
#include "IOutputWriter.hpp"

/**
 * RecommendCommand handles the recommendation logic and outputs results.
 * It uses the Recommender engine for logic and IOutputWriter for display.
 */
class RecommendCommand : public ICommand {
public:
    // Injecting both the logic engine and the output handler
    RecommendCommand(Recommender& recommender, IOutputWriter& writer);
    
    /**
     * Executes the recommendation process.
     * @param args Expected: [0] userId, [1] productId.
     */
    void execute(const std::vector<std::string>& args) override;

private:
    Recommender& engine;
    IOutputWriter& outputWriter;
};

#endif