#include <gtest/gtest.h>
#include "HelpCommand.hpp"
#include "IOutputWriter.hpp"
#include "Exceptions.hpp"
#include <string>
#include <vector>
#include <map>
#include <memory>

using namespace std;
 
namespace {
// mock output writer to capture text for testing instead of printing it
class TestPrinter : public IOutputWriter {
public:
    string savedText = "";
    
    // override to save the message to a string variable
    void write(const string& message) override {
        savedText += message; // append output to string
    }
};

// dummy command that does nothing except returning a specific help string
class MockCommand : public ICommand {
private:
    string helpText;
public:
    MockCommand(string text) : helpText(text) {}
    
    void execute(const vector<string>& args) override {}

    string getHelpText() const override {
        return helpText; // return dummy text
    }
};

}

// test 1: verify commands print alphabetically, with help last
TEST(HelpCommandTest, PrintsCorrectHelpText) {
    TestPrinter writer;

    // setup dummy commands
    map<string, shared_ptr<ICommand>> fakeCommands;
    fakeCommands["POST"] = make_shared<MockCommand>("POST, arguments: [userid] [productid1] [productid2] ...");
    fakeCommands["GET"] = make_shared<MockCommand>("GET, arguments: [userid] [productid]");
    fakeCommands["PATCH"] = make_shared<MockCommand>("PATCH, arguments: [userid] [productid1] [productid2] ...");
    fakeCommands["DELETE"] = make_shared<MockCommand>("DELETE, arguments: [userid] [productid1] [productid2]...");

    HelpCommand helpCmd(writer, fakeCommands);

    // execute with no arguments
    vector<string> args;
    helpCmd.execute(args);

    // define expected sorted output
    string expectedOutput = 
        "DELETE, arguments: [userid] [productid1] [productid2]...\n"
        "GET, arguments: [userid] [productid]\n"
        "PATCH, arguments: [userid] [productid1] [productid2] ...\n"
        "POST, arguments: [userid] [productid1] [productid2] ...\n"
        "help\n";

    // assert captured text matches expected output
    EXPECT_EQ(writer.savedText, expectedOutput);
}
// test 2: verify command throw the right exception when unwanted arguments are provided
TEST(HelpCommandTest, IgnoresMoreArguments) {
    TestPrinter writer;
    map<string, shared_ptr<ICommand>> fakeCommands;

    HelpCommand helpCmd(writer, fakeCommands);

    // execute with unwanted arguments
    vector<string> args = {"me", "please"};

    // throw the right exception
    EXPECT_THROW(helpCmd.execute(args), InvalidArgumentsException);
}