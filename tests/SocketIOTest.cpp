#include <gtest/gtest.h>
#include <sys/socket.h>
#include <unistd.h>
#include <string>

#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"

class SocketIOTest : public ::testing::Test {
protected:
    int sockets[2]; // מערך שיחזיק את שני צדדי הצינור שלנו

    void SetUp() override {
        // יוצרים זוג סוקטים מחוברים. sockets[0] יהיה השרת, sockets[1] יהיה הלקוח המדומה
        if (socketpair(AF_UNIX, SOCK_STREAM, 0, sockets) < 0) {
            FAIL() << "Failed to create socket pair for testing";
        }
    }

    void TearDown() override {
        close(sockets[0]);
        close(sockets[1]);
    }
};

// בודק שהקלט מצליח לקרוא שורה שלמה עד לירידת שורה
TEST_F(SocketIOTest, ReadsLineSuccessfully) {
    SocketInputSource inputSource(sockets[0]);
    
    // הלקוח המדומה שולח הודעה
    std::string messageFromClient = "hello server\n";
    write(sockets[1], messageFromClient.c_str(), messageFromClient.length());
    
    // השרת קורא את ההודעה
    std::string result = inputSource.readNextLine();
    
    EXPECT_EQ(result, "hello server");
}

// בודק שהקלט מתמודד נכון עם סוף קובץ (לקוח שהתנתק)
TEST_F(SocketIOTest, HandlesClientDisconnectOnRead) {
    SocketInputSource inputSource(sockets[0]);
    
    // סוגרים את הצד של הלקוח כדי לדמות ניתוק
    close(sockets[1]);
    
    // ניסיון קריאה צריך להחזיר מחרוזת ריקה
    std::string result = inputSource.readNextLine();
    
    EXPECT_EQ(result, "");
}

// בודק שהפלט נכתב בהצלחה לסוקט עם ירידת שורה בסוף
TEST_F(SocketIOTest, WritesMessageSuccessfully) {
    SocketOutputWriter outputWriter(sockets[0]);
    
    // השרת כותב הודעה
    std::string messageToClient = "400 Bad Request";
    outputWriter.write(messageToClient);
    
    // הלקוח המדומה קורא את ההודעה
    char buffer[256] = {0};
    int bytesRead = read(sockets[1], buffer, sizeof(buffer) - 1);
    
    ASSERT_GT(bytesRead, 0);
    std::string received(buffer);
    
    // מוודאים שההודעה הגיעה ושנוספה לה ירידת שורה אוטומטית
    EXPECT_EQ(received, "400 Bad Request\n");
}

// בודק התנהגות כשאין סוקט חוקי (למשל סוקט -1 כמו באתחול של main)
TEST_F(SocketIOTest, HandlesInvalidSocketGracefully) {
    SocketInputSource inputSource(-1);
    SocketOutputWriter outputWriter(-1);
    
    // לא אמור לקרוס, רק להחזיר ריק / לא לעשות כלום
    std::string result = inputSource.readNextLine();
    EXPECT_EQ(result, "");
    
    // כתיבה לא אמורה לזרוק חריגה
    EXPECT_NO_THROW(outputWriter.write("test message"));
}