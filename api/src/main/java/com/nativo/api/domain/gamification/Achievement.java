package com.nativo.api.domain.gamification;

import com.nativo.api.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "achievements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 2048)
    private String iconUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AchievementCategory category;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> criteria;

    @Column(nullable = false)
    @Builder.Default
    private int xpReward = 0;
}
