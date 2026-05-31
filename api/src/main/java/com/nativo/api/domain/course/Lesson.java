package com.nativo.api.domain.course;

import com.nativo.api.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.Instant;

@Entity
@Table(name = "lessons")
@SQLDelete(sql = "UPDATE lessons SET deleted_at = now() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    @Builder.Default
    private int xpReward = 10;

    @Column(nullable = false)
    @Builder.Default
    private int minimumScore = 70;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    private Instant deletedAt;
}
