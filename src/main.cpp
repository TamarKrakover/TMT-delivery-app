#include "core/TcpServer.hpp"
#include "repositories/FileDataRepository.hpp"
#include "core/Recommender.hpp"
#include <iostream>
#include <memory>

int main() {
    // Define the port the server will listen on
    const int port = 5555;

    try {
        // Initialize repository and load data ONCE for all future clients
        auto repo = std::make_unique<FileDataRepository>("../data/data.txt");
        repo->loadAllData();

        // Create the recommendation engine ONCE using the loaded repository
        Recommender recommender(*repo);

        // Instantiate the server, passing the shared data resources
        TcpServer server(port, *repo, recommender);

        std::cout << "Server is starting on port " << port << "..." << std::endl;

        // Launch the infinite server loop to start accepting connections
        server.start();
    } 
    catch (const std::exception& e) {
        // Catch errors during initialization (port already in use)
        std::cerr << "Fatal error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}