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
    
    auto addCmd = std::make_shared<AddCommand>(repo);
    commands["add"] = addCmd;
    commands["add_"] = addCmd; 
    
    commands["recommend"] = std::make_shared<RecommendCommand>(recommender, *output);
    
    // Pass the commands map to HelpCommand constructor
    commands["help"] = std::make_shared<HelpCommand>(*output, commands);
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

        auto it = commands.find(commandName);
        if (it != commands.end()) {
            try {
                it->second->execute(args);
            } catch (const BaseNotFoundException&) {
                output->write("404 Not Found\n");
            } catch (const BaseBadRequestException&) {
                output->write("400 Bad Request\n");
            } catch (...) {
                // Catch any other unexpected exceptions
            }
        } else {
            output->write("400 Bad Request");
        }
    }
}

void App::stop() {
    isRunning = false;
}