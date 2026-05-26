package com.nativo.api.application.course;

import java.util.List;
import java.util.UUID;

public record CourseDetailResponse(
        UUID id,
        String slug,
        String title,
        String description,
        String iconUrl,
        int totalXpReward,
        Integer estimatedHours,
        String difficulty,
        List<ModuleResponse> modules
) {
    public record ModuleResponse(
            UUID id,
            String title,
            String description,
            int displayOrder,
            List<LessonResponse> lessons
    ) {
        public record LessonResponse(
                UUID id,
                String title,
                String description,
                int displayOrder,
                int xpReward
        ) {}
    }
}
