#include "StandardOutput.hpp"
#include <iostream>

// writes the given message to the standard console output
void StandardOutput::write(const std::string& message) {
    std::cout << message;
}