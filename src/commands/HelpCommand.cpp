#include "HelpCommand.hpp"
#include "Exceptions.hpp"

using namespace std;


HelpCommand::HelpCommand(IOutputWriter& writer, const map<string, shared_ptr<ICommand>>&cmds) : outputWriter(writer), commandsMap(cmds) {}

// generate and output the help menu
void HelpCommand::execute(const vector<string>& args) {
    // if help command takes no arguments
    if(!args.empty()){
        throw InvalidArgumentsException();
    }

   string output = "";
    
   // map automatically sorts keys alphabetically
   for (const auto& [name, command] : commandsMap) {
    // append all commands except help
    if (name != "help") {
        output += command->getHelpText() + "\n";
    }
   }

   // append help last
   output += "help\n";

    // print the output    
    outputWriter.write(output);
}

// return the command's identifier
string HelpCommand::getHelpText() const {
    return "help";
}