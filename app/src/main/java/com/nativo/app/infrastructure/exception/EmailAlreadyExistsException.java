package com.nativo.app.infrastructure.exception;

/**
 * Thrown when a registration attempt uses an email already in use.
 * Maps to HTTP 409 Conflict in GlobalExceptionHandler.
 */
public class EmailAlreadyExistsException extends RuntimeException {

    public EmailAlreadyExistsException(String email) {
        super("Email already registered: " + email);
    }
}
