#include "HelpCommand.hpp"

// initialize with a specific output writer
HelpCommand::HelpCommand(IOutputWriter& writer) : outputWriter(writer) {}

void HelpCommand::execute(const std:: vector<std::string>& args) {
    // if help command takes no arguments
    if(!args.empty()){
        return;
    }

    // the help menu
    std::string helpText = 
        "add [userid] [productid 1] [productid2] ...\n"
        "recommend [userid] [productid]\n"
        "help\n";

    // print to the chosen output    
    outputWriter.write(helpText);
}