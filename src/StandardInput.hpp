#ifndef STANDARD_INPUT_HPP
#define STANDARD_INPUT_HPP

#include "IInputSource.hpp"
#include <string>

// implementation of IInputSource for reading from the console
class StandardInput : public IInputSource {
public:
    // reads a single line from the standard input
    std::string readNextLine() override;
};

#endif