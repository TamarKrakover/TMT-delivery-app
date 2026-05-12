#ifndef PATCH_COMMAND_HPP
#define PATCH_COMMAND_HPP

#include "ICommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include <vector>
#include <string>

// handles the PATCH command: adds products to an existing user
class PatchCommand : public ICommand {
public:
    // injects dependencies
    PatchCommand(IDataRepository& repository, IOutputWriter& writer);

     // Executes the main Patch command logic
    void execute(const std::vector<std::string>& args) override;

    std::string getHelpText() const override;

private:
    // reference to the injected output dependency
    IDataRepository& repo;
    IOutputWriter& outputWriter;
};

#endif