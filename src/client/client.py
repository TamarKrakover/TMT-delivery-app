import socket
import sys

def main():
    # Expecting IP and Port as command line arguments
    if len(sys.argv) != 3:
        sys.exit(1)

    ip = sys.argv[1]
    try:
        port = int(sys.argv[2])
    except ValueError:
        sys.exit(1)

    # Establish TCP connection
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect((ip, port))
    except Exception:
        sys.exit(1)

    try:
        while True:
            try:
                # Read command from standard input
                command = input()
            except EOFError:
                break

            # Send command to server safely
            try:
                client_socket.sendall((command + '\n').encode('utf-8'))
            except (BrokenPipeError, ConnectionResetError):
                break

            # Wait for and read the response
            response = b""
            server_disconnected = False
            while True:
                chunk = client_socket.recv(4096)
                if not chunk:
                    server_disconnected = True
                    break
                response += chunk
                
                # Check for the newline terminator
                if response.endswith(b'\n'):
                    break
            
            if server_disconnected:
                break

            # Print the server's output
            # if response:
            #     print(response.decode('utf-8').rstrip('\n'))
            if response:
                print(response.decode('utf-8'), end='')

    except KeyboardInterrupt:
        pass
    finally:
        client_socket.close()

if __name__ == "__main__":
    main()