/**
 * @file IOutputWriter.hpp
 * @brief Interface for output handling.
 * * This interface provides a generic way to display or log messages. 
 * Implementations can direct the output to the console, a log file, 
 * or a network socket, ensuring the business logic is not tied to a specific UI.
 */
#ifndef IOUTPUT_WRITER_HPP
#define IOUTPUT_WRITER_HPP

#include <string>

class IOutputWriter {
public:
    virtual ~IOutputWriter() = default;
    
    virtual void write(const std::string& message) = 0;
};

#endif