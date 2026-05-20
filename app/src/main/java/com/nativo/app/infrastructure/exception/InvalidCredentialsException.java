package com.nativo.app.infrastructure.exception;

/**
 * Thrown when login credentials are invalid (wrong email or password).
 * Maps to HTTP 401 Unauthorized in GlobalExceptionHandler.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}
