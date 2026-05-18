#include <iostream>
#include <memory>
#include <string>
#include <csignal>

#include "App.hpp"
#include "TcpServer.hpp"
#include "FileDataRepository.hpp"
#include "Recommender.hpp"
#include "SocketInputSource.hpp"
#include "SocketOutputWriter.hpp"

int main(int argc, char* argv[]) {
    // ignore Ctrl+C signals to prevent unexpected server termination
    signal(SIGINT, SIG_IGN);

    // validate command-line arguments
    if (argc < 2) {
        std::cerr << "Usage: ./TMTApp [port]" << std::endl;
        return 1;
    }

    // parse and validate the port number
    int port;
    try {
        port = std::stoi(argv[1]);
    } catch (...) {
        std::cerr << "Invalid port number" << std::endl;
        return 1;
    }

    // initialize and load the data repository from the specified file path
    auto repo = std::make_shared<FileDataRepository>("../data/data.txt");
    repo->loadAllData();

    // instantiate the recommendation engine with the data repository
    Recommender recommender(*repo);

    // create shared I/O abstractions
    auto input = std::make_shared<SocketInputSource>(-1);
    auto output = std::make_shared<SocketOutputWriter>(-1);

    // inject all required components into the core Application logic
    App app(input, output, *repo, recommender);

    // setup the TCP server with the configured port and application reference
    TcpServer server(port, app, input, output);

    // Start the server's listening loop to accept client connections
    server.start();

    return 0;
}