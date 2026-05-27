package com.nativo.api.application.course;

import java.util.UUID;

public record CourseListItem(
        UUID id,
        String slug,
        String title,
        String description,
        String iconUrl,
        int totalXpReward,
        Integer estimatedHours,
        String difficulty
) {}
