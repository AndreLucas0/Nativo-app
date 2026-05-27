package com.nativo.api.domain.gamification;

import com.nativo.api.domain.common.BaseEntity;
import com.nativo.api.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_achievements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAchievement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;

    @Column(nullable = false)
    private Instant earnedAt;
}
