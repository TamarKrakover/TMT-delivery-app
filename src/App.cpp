#include "App.hpp"
#include <sstream>

App::App(std::shared_ptr<IInputSource> in, 
         std::shared_ptr<IOutputWriter> out, 
         std::map<std::string, std::shared_ptr<ICommand>> cmds)
    : input(std::move(in)), output(std::move(out)), commands(std::move(cmds)), isRunning(true) {}

void App::run() {
    while (isRunning) {
        std::string line = input->readNextLine();
        
        // If the input stream is empty/closed, stop the loop
        if (line.empty()) {
             break;
        }

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

        auto it = commands.find(commandName);
        if (it != commands.end()) {
            try {
                it->second->execute(args);
            } catch (...) {
               // Ignore execution errors silently as per requirement
            }
        }
    }
}

void App::stop() {
    isRunning = false;
}