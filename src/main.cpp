#include <iostream>
#include <map>
#include <memory>
#include <string>

#include "App.hpp"
#include "TcpServer.hpp"
#include "FileDataRepository.hpp"
#include "Recommender.hpp"
#include "AddCommand.hpp"
#include "RecommendCommand.hpp"
#include "HelpCommand.hpp"
#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: ./TMTApp [port]" << std::endl;
        return 1;
    }

    int port;
    try {
        port = std::stoi(argv[1]);
    } catch (...) {
        std::cerr << "Invalid port number" << std::endl;
        return 1;
    }

    auto repo = std::make_shared<FileDataRepository>("../data/data.txt");
    repo->loadAllData();

    Recommender recommender(*repo);

    // יוצרים את אובייקטי הקלט והפלט עם סוקט מנותק (-1)
    auto input = std::make_shared<SocketInputSource>(-1);
    auto output = std::make_shared<SocketOutputWriter>(-1);

    std::map<std::string, std::shared_ptr<ICommand>> commands;
    
    // מעבירים את ה-output למי שצריך אותו! ה-TcpServer כבר ידאג לחבר אותו ללקוח בהמשך.
    commands["POST"] = std::make_shared<AddCommand>(*repo);
    commands["GET"] = std::make_shared<RecommendCommand>(recommender, *output);
    commands["help"] = std::make_shared<HelpCommand>(*output);

    App app(input, output, std::move(commands));

    // מעבירים לשרת את ה-input וה-output כדי שהוא יוכל לשנות להם את הסוקט בכל התחברות
    TcpServer server(port, app, input, output);
    std::cout << "Server is running on port " << port << "..." << std::endl;
    server.start();

    return 0;
}