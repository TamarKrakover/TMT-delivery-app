#include "RecommendCommand.hpp"

// Initialize the command with the recommender engine and output writer
RecommendCommand::RecommendCommand(Recommender& recommender, IOutputWriter& writer)
    : engine(recommender), outputWriter(writer) {}

void RecommendCommand::execute(const std::vector<std::string>& args) {
    // Command must have exactly 2 arguments. If not, ignore it.
    if (args.size() != 2) {
       return;
    }
    // Get the user ID and product ID from the input
    std::string userId = args[0];
    std::string productId = args[1];
    std::vector<std::string> results = engine.recommend(userId, productId);
    // If no recommendations were found, do nothing
    if (results.empty()) {
        return;
    }
    // Build the output string with spaces between products
    std::string output = "";
    for (size_t i = 0; i < results.size(); ++i) {
        output += results[i];
        if (i < results.size() - 1) {
            output += " ";
        }
    }
    // Add a newline at the end and print the result
    output += "\n";
    outputWriter.write(output);

}

std::string RecommendCommand::getHelpText() const {
    return "recommend [userid] [productid]";
}


