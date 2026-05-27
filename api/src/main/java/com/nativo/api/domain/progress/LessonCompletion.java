package com.nativo.api.domain.progress;

import com.nativo.api.domain.common.BaseEntity;
import com.nativo.api.domain.course.Course;
import com.nativo.api.domain.course.Lesson;
import com.nativo.api.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "lesson_completions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonCompletion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int xpEarned;

    @Column(nullable = false)
    private Instant completedAt;
}
