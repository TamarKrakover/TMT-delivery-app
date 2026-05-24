# Use the official GCC image
FROM gcc:latest

# Install cmake and unzip for GoogleTest extraction
RUN apt-get update && apt-get install -y \
    cmake \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory for the project
WORKDIR /app

# Copy the project files into the container
COPY . .

# Create build directory, configure with CMake, and compile all targets
RUN mkdir build && cd build && cmake .. && make

# Declare the data directory as a mount point for external volumes
VOLUME ["/app/data"]

# Set the working directory to the location of the binaries
WORKDIR /app/build

# Default command: Runs the server app (Compose will append the port)
CMD ["./TMTApp"]