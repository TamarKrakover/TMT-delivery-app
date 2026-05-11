#include "HelpCommand.hpp"

using namespace std;

// initialize with a specific output writer
HelpCommand::HelpCommand(IOutputWriter& writer, const map<string, shared_ptr<ICommand>>&cmds) : outputWriter(writer), commandsMap(cmds) {}

string HelpCommand::getHelpText() const {
    return "help";
}

void HelpCommand::execute(const vector<string>& args) {
    // if help command takes no arguments
    if(!args.empty()){
        return;
    }

   string output = "";
    
   for (const auto& [name, command] : commandsMap) {
    if (name != "help") {
        output += command->getHelpText() + "\n";
    }
   }

   output += "help\n";

    // print to the chosen output    
    outputWriter.write(output);
}