package com.nativo.api.application.progress;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProgressSummaryResponse(
        UUID courseId,
        String courseSlug,
        String courseTitle,
        String courseIconUrl,
        BigDecimal progressPercentage,
        int completedLessons,
        int totalLessons,
        int totalXpEarned,
        Instant startedAt,
        Instant completedAt
) {}
