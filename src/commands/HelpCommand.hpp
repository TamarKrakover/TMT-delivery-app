#ifndef HELP_COMMAND_HPP
#define HELP_COMMAND_HPP

#include "ICommand.hpp"
#include "IOutputWriter.hpp"
#include <vector>
#include <string>

// represents the command that displays the help menu
class HelpCommand : public ICommand {
public:
    // explicit prevents unintended implicit conversions from IOutputWriter
    explicit HelpCommand(IOutputWriter& writer);

    // executes the help logic (overrides ICommand interface)
    void execute(const std::vector<std::string>& args) override;

private:
    // reference to the injected output dependency
    IOutputWriter& outputWriter;
};

#endif
