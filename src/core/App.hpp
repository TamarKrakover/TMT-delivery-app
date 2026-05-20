#ifndef APP_HPP
#define APP_HPP

#include <map>
#include <memory>
#include <string>
#include <vector>

#include "IInputSource.hpp"
#include "IOutputWriter.hpp"
#include "ICommand.hpp"
#include "CommandParser.hpp"
#include "IDataRepository.hpp"
#include "Recommender.hpp"

using namespace std;

class App {
private:
    shared_ptr<IInputSource> input;
    shared_ptr<IOutputWriter> output;
    map<string, shared_ptr<ICommand>> commands; 
    CommandParser parser;
    bool isRunning;

public:
    // Constructor now initializes dependencies and commands internally
    App(shared_ptr<IInputSource> in, 
        shared_ptr<IOutputWriter> out, 
        IDataRepository& repo, 
        Recommender& recommender);

    void run();
    void stop();
};
#endif