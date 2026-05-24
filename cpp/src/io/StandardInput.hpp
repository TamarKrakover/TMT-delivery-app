#ifndef STANDARD_INPUT_HPP
#define STANDARD_INPUT_HPP

#include "IInputSource.hpp"
#include <string>
using namespace std;
// implementation of IInputSource for reading from the console
class StandardInput : public IInputSource {
public:
    // reads a single line from the standard input
    string readNextLine() override;
};

#endif