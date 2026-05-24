#include "StandardOutput.hpp"
#include <iostream>
using namespace std;
// writes the given message to the standard console output
void StandardOutput::write(const string& message) {
    cout << message;
}