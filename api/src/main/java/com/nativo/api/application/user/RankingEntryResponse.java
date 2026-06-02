package com.nativo.api.application.user;

import java.util.UUID;

public record RankingEntryResponse(
        int position,
        UUID userId,
        String name,
        String profileImageUrl,
        int totalXp,
        int currentLevel,
        int currentStreak,
        boolean isCurrentUser
) {}
