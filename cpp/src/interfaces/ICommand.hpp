/**
 * @file ICommand.hpp
 * @brief Interface for the Command Design Pattern.
 * * This interface defines the contract for all executable commands in the system.
 * It allows the application to execute various operations (like 'add' or 'recommend')
 * uniformly, supporting scalability and loose coupling.
 */
#ifndef ICOMMAND_HPP
#define ICOMMAND_HPP

#include <vector>
#include <string>
using namespace std;
class ICommand {
public:
    virtual ~ICommand() = default;
    
    virtual void execute(const vector<string>& args) = 0;

    virtual string getHelpText() const = 0;
};

#endif