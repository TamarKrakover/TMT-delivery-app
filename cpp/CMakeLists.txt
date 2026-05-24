cmake_minimum_required(VERSION 3.14)

project(TMTproject)

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

file(GLOB_RECURSE ALL_SRC "src/*.cpp")
file(GLOB_RECURSE TEST_SOURCES "tests/*.cpp")

set(APP_LOGIC ${ALL_SRC})
list(REMOVE_ITEM APP_LOGIC "${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp")

add_executable(TMTApp src/main.cpp ${APP_LOGIC})
target_include_directories(TMTApp PRIVATE 
    src
    src/interfaces
    src/commands
    src/core
    src/io
    src/repositories
)

add_executable(runTests ${APP_LOGIC} ${TEST_SOURCES})
target_include_directories(runTests PRIVATE 
    src
    src/interfaces
    src/commands
    src/core
    src/io
    src/repositories
)
target_link_libraries(runTests gtest_main)