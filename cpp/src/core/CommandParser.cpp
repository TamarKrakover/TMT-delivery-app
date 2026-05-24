#include "CommandParser.hpp"
#include "Exceptions.hpp"
#include <sstream>
#include <cctype>

using namespace std;

// accepting input and parse it to vector word by word
vector<string> CommandParser::parse(const string& input) {
    vector<string> words;

    // ignoring white spaces
    for (char c : input) {
        if(isspace(static_cast<unsigned char>(c)) && c != ' ') {
            throw InvalidArgumentsException();
        }
    }

    if (input.empty()) {
        return words;
    }

    istringstream iss(input);
    string currentWord;

    // parse the srting word by word to the new vector
    while(iss >> currentWord) {
        words.push_back(currentWord);
    }

    return words;
}