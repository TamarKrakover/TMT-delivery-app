#ifndef STANDARD_OUTPUT_HPP
#define STANDARD_OUTPUT_HPP

#include "IOutputWriter.hpp"
#include <string>
using namespace std;
// concrete implementation of IOutputWriter for standard console output
class StandardOutput : public IOutputWriter {
public:
    // writes a message string to the console
    void write(const string& message) override;
};

#endif