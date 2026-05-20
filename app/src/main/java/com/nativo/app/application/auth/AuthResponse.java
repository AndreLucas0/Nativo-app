package com.nativo.app.application.auth;

import java.util.UUID;

/**
 * Response returned by register, login, and refresh token operations.
 */
public record AuthResponse(
        UUID userId,
        String email,
        String name,
        String accessToken,
        String refreshToken
) {}
