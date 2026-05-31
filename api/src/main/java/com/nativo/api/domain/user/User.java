package com.nativo.api.domain.user;

import com.nativo.api.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted_at = now() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    private String profileImageUrl;

    @Builder.Default
    @Column(nullable = false)
    private int totalXp = 0;

    @Builder.Default
    @Column(nullable = false)
    private int currentLevel = 1;

    @Builder.Default
    @Column(nullable = false)
    private int currentStreak = 0;

    @Builder.Default
    @Column(nullable = false)
    private int longestStreak = 0;

    private LocalDate lastActivityDate;

    private Instant deletedAt;
}
