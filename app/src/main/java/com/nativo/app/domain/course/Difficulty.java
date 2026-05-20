package com.nativo.app.domain.course;

/**
 * Difficulty level of a course.
 * Stored as VARCHAR in the database (EnumType.STRING).
 */
public enum Difficulty {
    BEGINNER,
    INTERMEDIATE,
    ADVANCED
}
