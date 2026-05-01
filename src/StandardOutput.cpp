#include "StandardOutput.hpp"
#include <iostream>

void StandardOutput::write(const std::string& message) {
    std::cout << message;
}