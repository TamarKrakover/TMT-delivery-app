#include "App.hpp"
#include "Exceptions.hpp"
#include "AddCommand.hpp"
#include "RecommendCommand.hpp"
#include "HelpCommand.hpp"

App::App(std::shared_ptr<IInputSource> in, 
         std::shared_ptr<IOutputWriter> out, 
         IDataRepository& repo, 
         Recommender& recommender)
    : input(std::move(in)), output(std::move(out)), isRunning(true) {
    
    // Commands are fixed per application instance
    auto addCmd = std::make_shared<AddCommand>(repo);
    commands["add"] = addCmd;
    commands["add_"] = addCmd; // Support for the add_ command
    
    commands["recommend"] = std::make_shared<RecommendCommand>(recommender, *output);
    commands["help"] = std::make_shared<HelpCommand>(*output);
}

void App::run() {
    while (isRunning) {
        std::string line = input->readNextLine();
        if (line.empty()) {
            break; 
        }

        std::vector<std::string> tokens = parser.parse(line);
        if (tokens.empty()) continue;

        std::string commandName = tokens[0];
        std::vector<std::string> args(tokens.begin() + 1, tokens.end());

        try {
            auto it = commands.find(commandName);
            if (it != commands.end()) {
                it->second->execute(args);
            } catch (...) { }
        } else {
            output->write("400 Bad Request");
        }
    }
}

void App::stop() {
    isRunning = false;
}