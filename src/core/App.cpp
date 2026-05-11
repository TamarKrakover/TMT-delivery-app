#include "App.hpp"

App::App(std::shared_ptr<IInputSource> in, 
         std::shared_ptr<IOutputWriter> out, 
         std::map<std::string, std::shared_ptr<ICommand>> cmds)
    : input(std::move(in)), output(std::move(out)), commands(std::move(cmds)), isRunning(true) {}

void App::run() {
    while (isRunning) {
        std::string line = input->readNextLine();
        if (line.empty()) {
            break; // הלקוח התנתק, יוצאים מהלולאה
        }

        std::vector<std::string> tokens = parser.parse(line);
        if (tokens.empty()) continue;

        std::string commandName = tokens[0];
        std::vector<std::string> args(tokens.begin() + 1, tokens.end());

        auto it = commands.find(commandName);
        if (it != commands.end()) {
            try {
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