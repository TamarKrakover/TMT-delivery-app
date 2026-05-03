#include <gtest/gtest.h>
#include "HelpCommand.hpp"
#include "IOutputWriter.hpp"
#include <string>
#include <vector>

using namespace std;

// mock output writer to capture text for testing instead of printing it
class TestPrinter : public IOutputWriter {
public:
    string savedText = "";
    
    // override to save the message to a string variable
    void write(const string& message) override {
        savedText += message;
    }
};

// Test 1: verify help text is printed correctly when no arguments are given
TEST(HelpCommandTest, PrintsCorrectHelpText) {
    TestPrinter myPrinter;
    HelpCommand helpCommand(myPrinter);
    vector<string> emptyInput;  // valid input (no arguments)

    string rightAnswer = 
    "add [userid] [productid 1] [productid2] ...\n"
    "recommend [userid] [productid]\n"
    "help\n";

    helpCommand.execute(emptyInput);

    // assert that the captured output matches the expected help string
    EXPECT_EQ(myPrinter.savedText, rightAnswer);


}

// Test 2: verify the command aborts if unexpected arguments are provided
TEST(HelpCommandTest, IgnoreExtraArguments) {
    TestPrinter myPrinter;
    HelpCommand helpCommand(myPrinter);

    std::vector<std::string> extraArgs = {"tmt"}; // invalid input (1 argument)
    helpCommand.execute(extraArgs);

    // assert that nothing was printed
    EXPECT_EQ(myPrinter.savedText, "");
}