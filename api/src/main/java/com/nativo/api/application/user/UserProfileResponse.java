package com.nativo.api.application.user;

import java.time.LocalDate;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String email,
        String name,
        String profileImageUrl,
        int totalXp,
        int currentLevel,
        int currentStreak,
        int longestStreak,
        LocalDate lastActivityDate
) {}
