#ifndef HELP_COMMAND_HPP
#define HELP_COMMAND_HPP

#include "ICommand.hpp"
#include "IOutputWriter.hpp"
#include <vector>
#include <string>
#include <map>
#include <memory>
using namespace std;

// represents the command that displays the help menu
class HelpCommand : public ICommand {
public:
    // using a map for printing them alpabetichly
    HelpCommand(IOutputWriter& writer, const map<string, shared_ptr<ICommand>>& cmds);

    // executes the help logic (overrides ICommand interface)
    void execute(const vector<string>& args) override;

    // override getHelpText interface
    string getHelpText() const override;

private:
    // reference to the injected output dependency
    IOutputWriter& outputWriter;

    const map<string, shared_ptr<ICommand>>& commandsMap;
};

#endif
