#include "StandardInput.hpp"
#include <iostream>
using namespace std;
// reads the next line of text from the standard input 
string StandardInput::readNextLine() {
    string line;

    // attempt to read a full line, return an empty string if EOF or error occurs
    if (!getline(cin, line)) {
        return ""; 
    }
    return line;
}