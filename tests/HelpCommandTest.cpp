#include <gtest/gtest.h>
#include "HelpCommand.hpp"
#include "IOutputWriter.hpp"
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
        savedText += message;
    }
};

class MockCommand : public ICommand {
private:
    string helpText;
public:
    MockCommand(string text) : helpText(text) {}
    
    void execute(const vector<string>& args) override {}

    string getHelpText() const override {
        return helpText;
    }
};

}

// Test 1:
TEST(HelpCommandTest, PrintsCorrectHelpText) {
    TestPrinter writer;

    map<string, shared_ptr<ICommand>> fakeCommands;
    fakeCommands["POST"] = make_shared<MockCommand>("POST, arguments: [userid] [productid1] [productid2] ...");
    fakeCommands["GET"] = make_shared<MockCommand>("GET, arguments: [userid] [productid]");
    fakeCommands["PATCH"] = make_shared<MockCommand>("PATCH, arguments: [userid] [productid1] [productid2] ...");
    fakeCommands["DELETE"] = make_shared<MockCommand>("DELETE, arguments: [userid] [productid1] [productid2]...");

    HelpCommand helpCmd(writer, fakeCommands);

    vector<string> args;
    helpCmd.execute(args);

    string expectedOutput = 
        "DELETE, arguments: [userid] [productid1] [productid2]...\n"
        "GET, arguments: [userid] [productid]\n"
        "PATCH, arguments: [userid] [productid1] [productid2] ...\n"
        "POST, arguments: [userid] [productid1] [productid2] ...\n"
        "help\n";

    EXPECT_EQ(writer.savedText, expectedOutput);
}
// Test 2:
TEST(HelpCommandTest, IgnoresMoreArguments) {
    TestPrinter writer;
    map<string, shared_ptr<ICommand>> fakeCommands;

    HelpCommand helpCmd(writer, fakeCommands);

    vector<string> args = {"me", "please"};
    helpCmd.execute(args);

    EXPECT_EQ(writer.savedText,"");
}