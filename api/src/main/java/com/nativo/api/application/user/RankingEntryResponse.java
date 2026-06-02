package com.nativo.api.application.user;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

public record RankingEntryResponse(
        int position,
        UUID userId,
        String name,
        String profileImageUrl,
        int totalXp,
        int currentLevel,
        int currentStreak,
        @JsonProperty("isCurrentUser") boolean isCurrentUser
) {}
