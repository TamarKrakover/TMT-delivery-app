# Use the official GCC image
FROM gcc:latest

# Install cmake and unzip for GoogleTest extraction
RUN apt-get update && apt-get install -y \
    cmake \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory for the project
WORKDIR /usr/src/mytest

# Copy the project files into the container
COPY . .

# Create build directory, configure with CMake, and compile all targets
# This builds both 'TMTApp' and 'runTests'
RUN mkdir build && cd build && cmake .. && make

# Set the working directory to the location of the binaries
WORKDIR /usr/src/mytest/build

# Default command: Runs the recommendation CLI application
# To run tests instead, use: docker run --rm <image_name> ./runTests
CMD ["./TMTApp"]