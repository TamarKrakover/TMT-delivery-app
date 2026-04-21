# Use the official GCC image which already includes C++ compilers and make
FROM gcc:latest

# Install cmake and unzip (unzip is required by CMake FetchContent to extract GoogleTest)
RUN apt-get update && apt-get install -y \
    cmake \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire contents of the current directory into the container
COPY . /usr/src/mytest

# Set the working directory
WORKDIR /usr/src/mytest

# Create a build directory and set it as the active working directory
RUN mkdir build
WORKDIR /usr/src/mytest/build

# Run CMake to configure the project, then compile it using make
RUN cmake .. && make

# Set the default command to run the compiled tests executable
CMD ["./runTests"]