#ifndef COMMAND_PARSER_HPP
#define COMMAND_PARSER_HPP

#include <string>
#include <vector>

// logic for parsing raw strings into command tokens
class CommandParser {
public:
    CommandParser() = default;

    // splits input by spaces. returns empty if non space whitespace is found.
    std::vector<std::string> parse(const std::string& input);
};

#endif