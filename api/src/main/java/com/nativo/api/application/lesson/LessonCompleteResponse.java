package com.nativo.api.application.lesson;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record LessonCompleteResponse(
        boolean passed,
        int score,
        int xpEarned,
        int totalXp,
        int currentLevel,
        int currentStreak,
        int longestStreak,
        BigDecimal progressPercentage,
        List<ExerciseFeedback> exercises
) {
    public record ExerciseFeedback(
            UUID exerciseId,
            boolean correct,
            String explanation
    ) {}
}
