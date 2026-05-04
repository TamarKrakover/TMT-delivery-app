#include "StandardInput.hpp"
#include <iostream>

// reads the next line of text from the standard input 
std::string StandardInput::readNextLine() {
    std::string line;

    // attempt to read a full line, return an empty string if EOF or error occurs
    if (!std::getline(std::cin, line)) {
        return ""; 
    }
    return line;
}