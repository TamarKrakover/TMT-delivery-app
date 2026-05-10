#ifndef TCP_SERVER_HPP
#define TCP_SERVER_HPP

class TcpServer {
public:
    /**
     * Constructor initializes the server on the given port.
     * @param port The port number to listen on (e.g., 5555)
     */
    explicit TcpServer(int port);
    
    /**
     * Destructor ensures the server socket is closed properly.
     */
    ~TcpServer();

    /**
     * Starts the main server loop to accept incoming client connections.
     */
    void start();

    /**
     * Handles a single client connection.
     * @param client_socket The file descriptor for the connected client.
     */
    void handleClient(int client_socket);

private:
    int server_port;
    int server_socket;

    
};

#endif