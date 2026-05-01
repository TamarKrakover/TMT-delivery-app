#include <map>
#include <memory>
#include <string>

#include "App.hpp"
#include "StandardInput.hpp"
#include "StandardOutput.hpp"
#include "FileDataRepository.hpp"
#include "Recommender.hpp"
#include "AddCommand.hpp"
#include "RecommendCommand.hpp"

int main() {
    auto input = std::make_shared<StandardInput>();
    auto output = std::make_shared<StandardOutput>();

    // Init repository and load data
    auto repo = std::make_unique<FileDataRepository>("data.txt");
    repo->loadAllData();

    // Create engine
    Recommender recommender(*repo);

    // Create command map
    std::map<std::string, std::shared_ptr<ICommand>> commands;
    
    commands["add"] = std::make_shared<AddCommand>(*repo);
    commands["recommend"] = std::make_shared<RecommendCommand>(recommender, *output);
    // Partner will add HelpCommand here
    
    // Run the app
    App app(input, output, std::move(commands));
    app.run();

    return 0;
}