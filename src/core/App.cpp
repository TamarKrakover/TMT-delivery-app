#include "App.hpp"
#include "Exceptions.hpp"
#include "PostCommand.hpp"
#include "PatchCommand.hpp"
#include "DeleteCommand.hpp"
#include "GetCommand.hpp"
#include "RecommendCommand.hpp"
#include "HelpCommand.hpp"

using namespace std;

App::App(shared_ptr<IInputSource> in, 
         shared_ptr<IOutputWriter> out, 
         IDataRepository& repo, 
         Recommender& recommender)
    : input(move(in)), output(move(out)), isRunning(true) {
    
    commands["post"] = make_shared<PostCommand>(repo, *output);
    commands["patch"] = make_shared<PatchCommand>(repo, *output);
    commands["delete"] = make_shared<DeleteCommand>(repo, *output);
    commands["get"] = make_shared<GetCommand>(repo, recommender, *output);
    commands["help"] = make_shared<HelpCommand>(*output, commands);
}

void App::run() {
    while (isRunning) {
        string line = input->readNextLine();
        if (line.empty()) {
            break; 
        }

        vector<string> tokens = parser.parse(line);
        if (tokens.empty()) continue;

        string commandName = tokens[0];

        vector<string> args(tokens.begin() + 1, tokens.end());

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