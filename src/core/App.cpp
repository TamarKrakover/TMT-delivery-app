#include "App.hpp"
#include "Exceptions.hpp"
#include <sstream>

App::App(std::shared_ptr<IInputSource> in, 
         std::shared_ptr<IOutputWriter> out, 
         std::map<std::string, std::shared_ptr<ICommand>> cmds)
    : input(std::move(in)), output(std::move(out)), commands(std::move(cmds)), isRunning(true) {}

void App::run() {
    while (isRunning) {
        std::string line = input->readNextLine();

        // use parser to get vector of words
        std::vector<std::string> tokens = parser.parse(line);

        // move to a valid line
        if(tokens.empty()) {
            continue;
        }

        // the first word is the command
        std::string commandName = tokens[0];

        // the other arguments
        std::vector<std::string> args(tokens.begin() + 1, tokens.end());

        try {
            auto it = commands.find(commandName);
            if (it != commands.end()) {
                it->second->execute(args);
            } else {
                throw UnknownCommandException();
            }
        } catch (const BaseNotFoundException& e) {
                // Logical errors
                output->write("404 Not Found\n");
            } 
            catch (const BaseBadRequestException& e) {
                // Syntax errors, invalid args, or unknown commands
                output->write("400 Bad Request\n");
            }
        }
}

void App::stop() {
    isRunning = false;
}