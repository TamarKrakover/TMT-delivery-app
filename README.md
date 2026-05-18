# Advanced-Programming



# TMTproject - Product Recommendation System (Client-Server)

## About The Application
 **Client-Server architecture** Product Recommendation System written in C++ with a Python CLI client. 

The application utilizes a collaborative filtering approach: when a user expresses interest in a specific product, the system finds other users with similar tastes who also viewed that product, and recommends additional products they watched, ranked by similarity weights.

With the client-server architecture, the C++ server listens on a TCP port, processes incoming structured commands from connected clients, interacts with a file-based repository, and returns standard protocol-like text responses (e.g., `200 Ok`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`).



![Run Screenshot](runScreenShot.png)

## How to Run

The application is completely containerized and managed using Docker Compose.

### Build the Image
To build the Docker image, run the following command in the root directory of the project:

# new commands:
build:
```bash
docker compose build
```

run server:
```bash
docker compose down --remove-orphans && PORT=8080 docker compose run --service-ports --use-aliases server
```

run client:
```bash
IP=server PORT=8080 docker compose run client
```

run test:
```bash
docker compose run tests
```

end of new commands

```
### available commands:

The application supports the following commands:  

`post [userid] [productid 1] [productid 2] ...`: Associates products with a new user. If the user already exists, returns 400 Bad Request. Data is automatically saved to the data/ directory.

`patch [userid] [productid 1] [productid 2] ...`: Appends new products to an existing user's history. Data is automatically saved to the data/ directory. If the user is not found, returns 404 Not Found.

`delete [userid] [productid 1] [productid 2] ...`: Deletes specified products from an existing user's history. Returns 204 No Content. If the user or any of the specified products do not exist, returns 404 Not Found.

`get [userid] [productid]`: Provides up to 10 ranked product recommendations for the given user based on the context of the specified product. Returns 200 Ok followed by a space-separated list of product IDs.

`help`: Displays the help menu listing all available commands in alphabetical order.


## Application Example:
Below is a demonstration of adding user data and requesting a recommendation:
```bash
> post 1 100 101 102 103
201 Created

> post 2 101 102 104 105 106
201 Created

> patch 1 105 107
204 No Content

> delete 1 103
204 No Content

> get 1 101
200 Ok

104 106
```

```
Advanced-Programming/
├── CMakeLists.txt
├── Dockerfile
├── docker-compose.yml
├── README.md
├── runScreenShot.png
├── data/
│   └── data.txt
├── src/
│   ├── main.cpp
│   ├── client/
│   │   ├── client.py
│   │   └── Dockerfile.client
│   ├── commands/
│   │   ├── PostCommand.cpp
│   │   ├── PostCommand.hpp
│   │   ├── PatchCommand.cpp
│   │   ├── PatchCommand.hpp
│   │   ├── DeleteCommand.cpp
│   │   ├── DeleteCommand.hpp
│   │   ├── HelpCommand.cpp
│   │   ├── HelpCommand.hpp
│   │   ├── RecommendCommand.cpp
│   │   └── RecommendCommand.hpp
│   ├── core/
│   │   ├── App.cpp
│   │   ├── App.hpp
│   │   ├── CommandParser.cpp
│   │   ├── CommandParser.hpp
│   │   ├── Exceptions.hpp
│   │   ├── Recommender.cpp
│   │   ├── Recommender.hpp
│   │   ├── TcpServer.cpp
│   │   └── TcpServer.hpp
│   ├── interfaces/
│   │   ├── ICommand.hpp
│   │   ├── IDataRepository.hpp
│   │   ├── IInputSource.hpp
│   │   └── IOutputWriter.hpp
│   ├── io/
│   │   ├── SocketInputSource.cpp
│   │   ├── SocketInputSource.hpp
│   │   ├── SocketOutputWriter.cpp
│   │   ├── SocketOutputWriter.hpp
│   │   ├── StandardInput.cpp
│   │   ├── StandardInput.hpp
│   │   ├── StandardOutput.cpp
│   │   └── StandardOutput.hpp
│   └── repositories/
│       ├── FileDataRepository.cpp
│       └── FileDataRepository.hpp
└── tests/
    ├── AppTest.cpp
    ├── CommandParserTest.cpp
    ├── DeleteCommandTest.cpp
    ├── E2ETest.cpp
    ├── FileDataRepositoryTest.cpp
    ├── GetCommandTest.cpp
    ├── HelpCommandTest.cpp
    ├── PatchCommandTest.cpp
    ├── PostCommandTest.cpp
    ├── RecommaderTest.cpp
    ├── RecommendCommandTest.cpp
    ├── SocketInputSourceTest.cpp
    ├── SocketIOTest.cpp
    ├── SocketOutputWriterTest.cpp
    └── TcpServerTest.cpp
```

## Architecture & Design Notes
#### Client-Server & Networking: 
The communication tier relies on standard TCP sockets. The C++ TcpServer encapsulates the connection listener, updating the injected SocketInputSource and SocketOutputWriter dynamically on each new client handshake without modifying core execution flow.

#### Persistence: 
All data manipulated via post, patch, and delete commands is synchronized with data/data.txt using the FileDataRepository. File operations are carefully guarded to minimize disk writes, executing only when actual mutations occur.

#### Interface-Driven Design:
Following SOLID principles, the project strictly binds logic to generic abstractions (ICommand, IDataRepository, IInputSource, IOutputWriter). This decoupling allows the application layer to remain entirely agnostic of whether it is drawing input from a terminal console, a raw socket line, or mock testing scripts.


## Design and SOLID Principles Analysis from EX1

In this iteration, we focused heavily on maintaining a **loosely coupled** architecture and adhering strictly to the **SOLID principles**, with a strong emphasis on the **Open/Closed Principle (OCP)**. This ensures that the codebase remains highly maintainable and easily extendable for future modifications.

### 1. Changes to Command Names
* **Impact:** Minimal.
* **Analysis:** Altering command names only required updating the command registry mapping (e.g., inside `app.cpp`) where names are bound to their respective objects, without modifying any core business logic. Because the command execution engine is completely decoupled from the string representations of the commands, the core system remained closed to modification.

### 2. Addition of New Commands
* **Impact:** minimal
* **Analysis:** Introducing new commands did not require any modifications to existing command classes or the core execution engine. Utilizing a polymorphic Command Pattern allowed us to extend the system's capabilities simply by adding new classes that implement the standard command interface, leaving the existing, tested code entirely untouched.

### 3. Changes to Command Output Format
* **Impact:** Required refactoring for better encapsulation.
* **Analysis:** Initially, the `help` command directly handled the printing logic and details of all available commands. This setup violated the Open/Closed Principle when command arguments or output specifications changed, as it forced modifications inside the `help` logic. To resolve this, we refactored the `ICommand` interface to include a dedicated method that enables each command to expose its own metadata and arguments. The `help` command now dynamically aggregates and displays this information polymorphically. This adjustment ensures that any future changes to a command's signature or output format are entirely encapsulated within that specific command class.

### 4. Transitioning Input/Output from Console to Sockets
* **Impact:** minimal
* **Analysis:** Shifting the data source and destination from the standard console (`std::cin`/`std::cout`) to network sockets did not require any modifications to our core logic or command implementations. By abstracting the input and output streams behind dedicated interfaces, the commands remain completely agnostic of the underlying communication medium. Whether data is transmitted via the terminal or a socket connection, the execution logic treats it identically, demonstrating strong separation of concerns and loose coupling.