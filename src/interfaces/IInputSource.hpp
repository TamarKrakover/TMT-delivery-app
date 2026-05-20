/**
 * @file IInputSource.hpp
 * @brief Interface for input handling.
 * * This interface defines how the system receives raw input. It allows the 
 * application to switch between different input streams, such as standard 
 * console input (CLI) or automated test scripts, without changing the core logic.
 */
#ifndef IINPUT_SOURCE_HPP
#define IINPUT_SOURCE_HPP

#include <string>
using namespace std;
class IInputSource {
public:
    virtual ~IInputSource() = default;
    
    virtual string readNextLine() = 0;
};

#endif