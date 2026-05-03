#include <gtest/gtest.h>
#include "CommandParser.hpp"
#include <vector>
#include <string>

using namespace std;

// verifies basic parsing of a valid command into words.
TEST(CommandParserTest, ParserTheInput) {
    CommandParser parser;
    string input = "add 1 2 3";
    vector<string> result = parser.parse(input);

    ASSERT_EQ(result.size(), 4);
    EXPECT_EQ(result[0], "add");
    EXPECT_EQ(result[1], "1");
    EXPECT_EQ(result[2], "2");
    EXPECT_EQ(result[3], "3");

}

// ensures multiple spaces are correctly handled 
TEST(CommandParserTest, MultipleSpaces) {
    CommandParser parser;
    string input = "add     1      2                 3";
    vector<string> result = parser.parse(input);

    ASSERT_EQ(result.size(),  4);
    EXPECT_EQ(result[0], "add");
    EXPECT_EQ(result[1], "1");
    EXPECT_EQ(result[2], "2");
    EXPECT_EQ(result[3], "3");
}

// verifies that input containing only spaces returns an empty vector
TEST(CommandParserTest, EmptyInput) {
    CommandParser parser;
    string input = "    ";
    vector<string> result = parser.parse(input);

    EXPECT_TRUE(result.empty());
}

// confirms rejection of tabs to strictly follow the "spaces only" rule
TEST(CommandParserTest, RejectsTabs) {
    CommandParser parser;

    string input = "add\t1\t2";
    vector<string> result = parser.parse(input);

    EXPECT_TRUE(result.empty());
}
