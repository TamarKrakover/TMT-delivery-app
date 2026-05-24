#ifndef COMMAND_PARSER_HPP
#define COMMAND_PARSER_HPP

#include <string>
#include <vector>
using namespace std;
// logic for parsing raw strings into command tokens
class CommandParser {
public:
    CommandParser() = default;

    // splits input by spaces. returns empty if non space whitespace is found.
    vector<string> parse(const string& input);
};

#endif