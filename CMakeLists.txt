cmake_minimum_required(VERSION 3.14)

project(TMTproject)

# GoogleTest requires at least C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()


file(GLOB SRC_FILES "src/*.cpp")
file(GLOB TEST_SOURCES "tests/*.cpp")

add_executable(runTests ${SRC_FILES} ${TEST_SOURCES})

target_include_directories(runTests PRIVATE src)

target_link_libraries(runTests gtest_main)