package com.nativo.api.application.lesson;

import java.util.List;
import java.util.UUID;

public record LessonContentResponse(
        UUID id,
        String title,
        String description,
        String content,
        int xpReward,
        int minimumScore,
        boolean alreadyCompleted,
        List<ExerciseResponse> exercises
) {
    public record ExerciseResponse(
            UUID id,
            String question,
            String exerciseType,
            List<String> options,
            int displayOrder
    ) {}
}
