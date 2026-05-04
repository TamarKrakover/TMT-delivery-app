#ifndef STANDARD_OUTPUT_HPP
#define STANDARD_OUTPUT_HPP

#include "IOutputWriter.hpp"
#include <string>

// concrete implementation of IOutputWriter for standard console output
class StandardOutput : public IOutputWriter {
public:
    // writes a message string to the console
    void write(const std::string& message) override;
};

#endif