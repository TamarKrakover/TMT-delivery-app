// src/core/Exceptions.hpp
#ifndef EXCEPTIONS_HPP
#define EXCEPTIONS_HPP

#include <stdexcept>

// --- Base Exceptions ---

/**
 * @brief Base exception for all 404 Not Found errors.
 */
class BaseNotFoundException : public std::runtime_error {
public:
    // Pass a fixed string to satisfy std::runtime_error
    BaseNotFoundException() : std::runtime_error("404 Not Found") {}
};

/**
 * @brief Base exception for all 400 Bad Request errors.
 */
class BaseBadRequestException : public std::runtime_error {
public:
    // Pass a fixed string to satisfy std::runtime_error
    BaseBadRequestException() : std::runtime_error("400 Bad Request") {}
};

// --- Derived Exceptions (Inherit from BaseNotFoundException) ---

class UserNotFoundException : public BaseNotFoundException {};

class ProductNotFoundException : public BaseNotFoundException {};

// --- Derived Exceptions (Inherit from BaseBadRequestException) ---

class InvalidArgumentsException : public BaseBadRequestException {};

class UserAlreadyExistsException : public BaseBadRequestException {};

class UnknownCommandException : public BaseBadRequestException {};

#endif