package com.nativo.api.application.course;

import java.time.Instant;
import java.util.UUID;

public record EnrollResponse(
        UUID progressId,
        UUID courseId,
        String courseSlug,
        Instant startedAt
) {}
