#ifndef STANDARD_INPUT_HPP
#define STANDARD_INPUT_HPP

#include "IInputSource.hpp"
#include <string>

class StandardInput : public IInputSource {
public:
    std::string readNextLine() override;
};

#endif