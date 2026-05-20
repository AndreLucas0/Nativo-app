package com.nativo.app.domain.gamification;

/**
 * Category of an achievement, used for grouping and criteria validation.
 * Stored as VARCHAR in the database (EnumType.STRING).
 */
public enum AchievementCategory {
    STREAK,
    LESSONS,
    XP,
    COURSE,
    SPECIAL
}
