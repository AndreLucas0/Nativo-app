package com.nativo.app.infrastructure.exception;

/**
 * Thrown when an operation conflicts with existing state (e.g. duplicate resource).
 * Maps to HTTP 409 Conflict in GlobalExceptionHandler.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
