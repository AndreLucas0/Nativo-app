package com.nativo.app.domain.gamification;

import com.nativo.app.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Records an achievement unlocked by a user.
 *
 * The unique constraint on (userId, achievementId) prevents
 * the same achievement from being awarded twice to the same user.
 *
 * Prepared for Fase 2 — no REST endpoints in MVP-1.
 * No soft delete and no updatedAt — immutable record of an unlock event.
 */
@Entity
@Table(
    name = "user_achievements",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_achievements_user_achievement",
                          columnNames = {"user_id", "achievement_id"})
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** The user who unlocked the achievement. CASCADE: deleted when user is deleted. */
    @NotNull(message = "User is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_user_achievements_user"))
    private User user;

    /** The achievement that was unlocked. RESTRICT: achievement cannot be deleted while records exist. */
    @NotNull(message = "Achievement is required")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "achievement_id", nullable = false,
                foreignKey = @ForeignKey(name = "fk_user_achievements_achievement"))
    private Achievement achievement;

    /** When the achievement was unlocked. Set explicitly on creation. */
    @NotNull(message = "Unlocked at is required")
    @Column(name = "unlocked_at", nullable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime unlockedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP(3) WITH TIME ZONE")
    private LocalDateTime createdAt;

    public UserAchievement(User user, Achievement achievement, LocalDateTime unlockedAt) {
        this.user = user;
        this.achievement = achievement;
        this.unlockedAt = unlockedAt;
    }
}
