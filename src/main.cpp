#include <iostream>
#include <memory>
#include <string>

#include "App.hpp"
#include "TcpServer.hpp"
#include "FileDataRepository.hpp"
#include "Recommender.hpp"
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

    auto input = std::make_shared<SocketInputSource>(-1);
    auto output = std::make_shared<SocketOutputWriter>(-1);

    // No need to build the map here anymore
    App app(input, output, *repo, recommender);

    TcpServer server(port, app, input, output);
    std::cout << "Server is running on port " << port << "..." << std::endl;
    server.start();

    return 0;
}