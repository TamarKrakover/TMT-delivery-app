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

        std::istringstream iss(line);
        std::string commandName;
        iss >> commandName;

        std::vector<std::string> args;
        std::string arg;
        while (iss >> arg) {
            args.push_back(arg);
        }

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