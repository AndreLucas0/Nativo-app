package com.nativo.app.infrastructure.exception;

/**
 * Thrown when a JWT refresh token is invalid or expired.
 * Maps to HTTP 401 Unauthorized in GlobalExceptionHandler.
 */
public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(String message) {
        super(message);
    }
}
