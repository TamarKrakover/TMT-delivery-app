#ifndef STANDARD_OUTPUT_HPP
#define STANDARD_OUTPUT_HPP

#include "IOutputWriter.hpp"
#include <string>

class StandardOutput : public IOutputWriter {
public:
    void write(const std::string& message) override;
};

#endif