package com.nativo.app.domain.gamification;

import com.nativo.app.domain.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;

/**
 * Defines an achievement that users can unlock.
 *
 * The {@code criteria} field is stored as JSONB, allowing flexible
 * unlock conditions per category without schema changes:
 * - STREAK:  { "consecutiveDays": 7 }
 * - LESSONS: { "lessonsCompleted": 10 }
 * - XP:      { "totalXp": 500 }
 * - COURSE:  { "courseId": "uuid" }
 * - SPECIAL: any custom structure
 *
 * Achievements are prepared for Fase 2 — no REST endpoints in MVP-1.
 * No soft delete — achievements are managed via isActive flag instead.
 */
@Entity
@Table(name = "achievements")
@Getter
@Setter
@NoArgsConstructor
public class Achievement extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @NotBlank(message = "Achievement name is required")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotBlank(message = "Achievement description is required")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_url", columnDefinition = "TEXT")
    private String iconUrl;

    @NotNull(message = "Category is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 20)
    private AchievementCategory category;

    /**
     * JSON object defining the unlock criteria for this achievement.
     * Structure varies by category — see class-level Javadoc.
     * Stored as JSONB in PostgreSQL for efficient querying.
     */
    @NotNull(message = "Criteria is required")
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "criteria", nullable = false, columnDefinition = "jsonb")
    private String criteria;

    @Min(value = 0, message = "XP reward cannot be negative")
    @Column(name = "xp_reward", nullable = false)
    private int xpReward = 0;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Positive(message = "Display order must be positive")
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    public Achievement(String name, String description, AchievementCategory category,
                       String criteria, int displayOrder) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.criteria = criteria;
        this.displayOrder = displayOrder;
    }
}
