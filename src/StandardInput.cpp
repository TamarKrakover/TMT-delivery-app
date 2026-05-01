#include "StandardInput.hpp"
#include <iostream>

std::string StandardInput::readNextLine() {
    std::string line;
    if (!std::getline(std::cin, line)) {
        return ""; 
    }
    return line;
}