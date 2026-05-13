#ifndef POST_COMMAND_HPP
#define POST_COMMAND_HPP

#include "ICommand.hpp"
#include "IDataRepository.hpp"
#include "IOutputWriter.hpp"
#include <vector>
#include <string>

// handles the POST command: adds products to a new user
class PostCommand : public ICommand {
public:
    // injects dependencies
    PostCommand(IDataRepository& repository, IOutputWriter& writer);

    // Executes the main Post command logic
    void execute(const std::vector<std::string>& args) override;
    std::string getHelpText() const override;

private:
    // reference to the injected output dependency
    IDataRepository& repo;
    IOutputWriter& outputWriter;
};  

#endif


