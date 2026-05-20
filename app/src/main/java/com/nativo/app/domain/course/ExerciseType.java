package com.nativo.app.domain.course;

/**
 * Type of interactive exercise within a lesson.
 * Stored as VARCHAR in the database (EnumType.STRING).
 */
public enum ExerciseType {
    MULTIPLE_CHOICE,
    TRUE_FALSE,
    FILL_CODE,
    MATCH,
    ORDER_STEPS
}
