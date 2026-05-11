#ifndef HELP_COMMAND_HPP
#define HELP_COMMAND_HPP

#include "ICommand.hpp"
#include "IOutputWriter.hpp"
#include <vector>
#include <string>
#include <map>
#include <memory>

// represents the command that displays the help menu
class HelpCommand : public ICommand {
public:
    // using a map for printing them alpabetichly
    HelpCommand(IOutputWriter& writer, const std::map<std::string, std::shared_ptr<ICommand>>& cmds);

    // executes the help logic (overrides ICommand interface)
    void execute(const std::vector<std::string>& args) override;

    // override getHelpText interface
    std::string getHelpText() const override;

private:
    // reference to the injected output dependency
    IOutputWriter& outputWriter;

    const std::map<std::string, std::shared_ptr<ICommand>>& commandsMap;
};

#endif
