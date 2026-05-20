package com.nativo.app.infrastructure.exception;

/**
 * Thrown when a requested resource does not exist or is not accessible.
 * Maps to HTTP 404 Not Found in GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Object id) {
        super(resourceName + " not found with id: " + id);
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
