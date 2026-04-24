cmake_minimum_required(VERSION 3.14)

project(TMTproject)

# Set C++ standard to 17 as required
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --- GoogleTest Setup ---
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

# --- Files Discovery ---
# Collect all source files except main.cpp (if you have one) to avoid multiple main() functions
file(GLOB SRC_FILES "src/*.cpp")
file(GLOB TEST_SOURCES "tests/*.cpp")

# --- Targets ---

# 1. The Main Application (The CLI tool) [cite: 29]
# Note: If you create a main.cpp for the actual app, add it here
add_executable(recommendApp ${SRC_FILES})
target_include_directories(recommendApp PRIVATE src)

# 2. The Test Suite 
add_executable(runTests ${SRC_FILES} ${TEST_SOURCES})
target_include_directories(runTests PRIVATE src)
target_link_libraries(runTests gtest_main)