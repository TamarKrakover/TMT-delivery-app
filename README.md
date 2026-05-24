# Advanced-Programming



# TMTproject - Product Recommendation System (Client-Server)

## About The Application
 **Client-Server architecture** Product Recommendation System written in C++ with a Python CLI client. 

The application utilizes a collaborative filtering approach: when a user expresses interest in a specific product, the system finds other users with similar tastes who also viewed that product, and recommends additional products they watched, ranked by similarity weights.

With the client-server architecture, the C++ server listens on a TCP port, processes incoming structured commands from connected clients, interacts with a file-based repository, and returns standard protocol-like text responses (e.g., `200 Ok`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`).



![Run Screenshot](runScreenShot.png)

## How to Run

The application is completely containerized and managed using `Docker Compose`.

### Build the Image
To build the Docker image, run the following command in the root directory of the project:

Build:
```bash
docker compose build
```

Run server:
```bash
docker compose down --remove-orphans && PORT=8080 docker compose run --service-ports --use-aliases server
```
*__Note:__ The `down --remove-orphans` command is intentionally prepended to clear any lingering background containers and free up the port before starting a new server instance.*

Run client:
```bash
IP=server PORT=8080 docker compose run client
```
*__Note:__ The port number is fully configurable. You can choose any available port for the server and client by changing the `PORT=8080` variable in the commands above. Just ensure that both the server and the client are set to use the same port.*

Run tests:
```bash
docker compose run tests
```

### Available commands:

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

## Architecture & Design Notes
#### Client-Server & Networking: 
The communication tier relies on standard TCP sockets. The C++ TcpServer encapsulates the connection listener, updating the injected SocketInputSource and SocketOutputWriter dynamically on each new client handshake without modifying core execution flow.

#### Persistence: 
All data manipulated via post, patch, and delete commands is synchronized with data/data.txt using the FileDataRepository. File operations are carefully guarded to minimize disk writes, executing only when actual mutations occur.

#### Interface-Driven Design:
Following SOLID principles, the project strictly binds logic to generic abstractions (ICommand, IDataRepository, IInputSource, IOutputWriter). This decoupling allows the application layer to remain entirely agnostic of whether it is drawing input from a terminal console, a raw socket line, or mock testing scripts.


## Design and SOLID Principles Analysis from EX1

#### 1. Did changing the command names require modifying code that should be "closed for modification but open for extension"?
No, The command execution engine is completely decoupled from the string representations of the commands. Command names are bound to their respective objects inside a centralized command registry mapping (within app.cpp). Altering a name only required a minor update to this registry configuration, leaving the core business logic completely untouched and closed to modification.

#### 2. Did adding new commands require modifying code that should be "closed for modification but open for extension"?
No, By utilizing a polymorphic Command Pattern based on the ICommand interface, the system is natively open for extension. Introducing new capabilities only required creating new standalone classes that implement the interface. The core execution engine and existing, tested command classes remained entirely unaffected.

#### 3. Did changing the command output format require modifying code that should be "closed for modification but open for extension"?
Yes, the help command directly managed the printing logic and details of all available commands. This setup broke the Open/Closed Principle because any change to a command's arguments or output specifications forced us to modify the inner logic of the help command.
To fix this, we refactored the ICommand interface to include a dedicated metadata method. Now, each command encapsulates and exposes its own signature and arguments, and the help command dynamically aggregates this information polymorphically. Future format changes are now entirely contained within their specific command classes.

#### 4. Did transitioning the input/output from the console to sockets require modifying code that should be "closed for modification but open for extension"?
No, Following strict Interface-Driven Design, input and output streams were abstracted behind generic interfaces (IInputSource and IOutputWriter). The core application layer and command logic remain entirely agnostic of the underlying communication medium.
Whether data passes through the standard terminal (std::cin/std::cout) or raw network sockets (dynamically updated by the TcpServer via SocketInputSource and SocketOutputWriter), the execution logic treats them identically.

## Architecture:

```
Advanced-Programming/
├── README.md
├── UMLTask2.png
├── client/
│   ├── Dockerfile.client
│   └── client.py
├── cpp/
│   ├── CMakeLists.txt
│   ├── Dockerfile
│   ├── src/
│   │   ├── commands/
│   │   │   ├── DeleteCommand.cpp
│   │   │   ├── DeleteCommand.hpp
│   │   │   ├── GetCommand.cpp
│   │   │   ├── GetCommand.hpp
│   │   │   ├── HelpCommand.cpp
│   │   │   ├── HelpCommand.hpp
│   │   │   ├── PatchCommand.cpp
│   │   │   ├── PatchCommand.hpp
│   │   │   ├── PostCommand.cpp
│   │   │   └── PostCommand.hpp
│   │   ├── core/
│   │   │   ├── App.cpp
│   │   │   ├── App.hpp
│   │   │   ├── CommandParser.cpp
│   │   │   ├── CommandParser.hpp
│   │   │   ├── Exceptions.hpp
│   │   │   ├── Recommender.cpp
│   │   │   ├── Recommender.hpp
│   │   │   ├── TcpServer.cpp
│   │   │   └── TcpServer.hpp
│   │   ├── interfaces/
│   │   │   ├── ICommand.hpp
│   │   │   ├── IDataRepository.hpp
│   │   │   ├── IInputSource.hpp
│   │   │   └── IOutputWriter.hpp
│   │   ├── io/
│   │   │   ├── SocketInputSource.cpp
│   │   │   ├── SocketInputSource.hpp
│   │   │   ├── SocketOutputWriter.cpp
│   │   │   ├── SocketOutputWriter.hpp
│   │   │   ├── StandardInput.cpp
│   │   │   ├── StandardInput.hpp
│   │   │   ├── StandardOutput.cpp
│   │   │   └── StandardOutput.hpp
│   │   ├── main.cpp
│   │   └── repositories/
│   │       ├── FileDataRepository.cpp
│   │       └── FileDataRepository.hpp
│   └── tests/
│       ├── AppTest.cpp
│       ├── CommandParserTest.cpp
│       ├── DeleteCommandTest.cpp
│       ├── E2ETest.cpp
│       ├── FileDataRepositoryTest.cpp
│       ├── GetCommandTest.cpp
│       ├── HelpCommandTest.cpp
│       ├── PatchCommandTest.cpp
│       ├── PostCommandTest.cpp
│       ├── RecommenderTest.cpp
│       ├── SocketIOTest.cpp
│       ├── SocketInputSourceTest.cpp
│       ├── SocketOutputWriterTest.cpp
│       └── TcpServerTest.cpp
├── data/
│   └── data.txt
└── docker-compose.yml
```
