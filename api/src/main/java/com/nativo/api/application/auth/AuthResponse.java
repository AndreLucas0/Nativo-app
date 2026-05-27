package com.nativo.api.application.auth;

import java.util.UUID;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserInfo user
) {
    public record UserInfo(
            UUID id,
            String name,
            String email,
            int totalXp,
            int currentLevel
    ) {}
}
