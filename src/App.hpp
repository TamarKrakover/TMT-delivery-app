#ifndef APP_HPP
#define APP_HPP

#include <map>
#include <memory>
#include <string>
#include <vector>

#include "IInputSource.hpp"
#include "IOutputWriter.hpp"
#include "ICommand.hpp"

class App {
private:
    std::shared_ptr<IInputSource> input;
    std::shared_ptr<IOutputWriter> output;
    std::map<std::string, std::shared_ptr<ICommand>> commands;
    
    // Flag to control the run loop for testing purposes
    bool isRunning;

public:
    App(std::shared_ptr<IInputSource> in, 
        std::shared_ptr<IOutputWriter> out, 
        std::map<std::string, std::shared_ptr<ICommand>> cmds);

    // Runs the application loop
    void run();
    
    // Method to break the infinite loop specifically for testing
    void stop();
};

#endif