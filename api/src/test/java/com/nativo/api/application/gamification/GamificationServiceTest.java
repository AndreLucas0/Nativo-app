package com.nativo.api.application.gamification;

import com.nativo.api.domain.progress.UserProgress;
import com.nativo.api.domain.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

class GamificationServiceTest {

    private GamificationService service;

    @BeforeEach
    void setUp() {
        service = new GamificationService();
    }

    // --- XP and level ---

    @Test
    void xpIsAddedToUserAndProgress() {
        var user = userWithXp(0);
        var progress = progressWithXp(0);

        service.processXpAndStreak(user, progress, 50);

        assertThat(user.getTotalXp()).isEqualTo(50);
        assertThat(progress.getTotalXpEarned()).isEqualTo(50);
    }

    @Test
    void levelFormula_level1AtZeroXp() {
        var user = userWithXp(0);
        service.processXpAndStreak(user, progressWithXp(0), 0);
        assertThat(user.getCurrentLevel()).isEqualTo(1);
    }

    @Test
    void levelFormula_level2At100Xp() {
        var user = userWithXp(0);
        service.processXpAndStreak(user, progressWithXp(0), 100);
        // floor(sqrt(100/100)) + 1 = floor(1.0) + 1 = 2
        assertThat(user.getCurrentLevel()).isEqualTo(2);
    }

    @Test
    void levelFormula_level4At900Xp() {
        var user = userWithXp(0);
        service.processXpAndStreak(user, progressWithXp(0), 900);
        // floor(sqrt(900/100)) + 1 = floor(3.0) + 1 = 4
        assertThat(user.getCurrentLevel()).isEqualTo(4);
    }

    // --- Streak ---

    @Test
    void streak_firstActivity_setsStreakTo1() {
        var user = userWithXp(0);
        user.setLastActivityDate(null);
        user.setCurrentStreak(0);

        service.processXpAndStreak(user, progressWithXp(0), 10);

        assertThat(user.getCurrentStreak()).isEqualTo(1);
        assertThat(user.getLastActivityDate()).isEqualTo(LocalDate.now());
    }

    @Test
    void streak_consecutiveDay_incrementsStreak() {
        var user = userWithXp(0);
        user.setLastActivityDate(LocalDate.now().minusDays(1));
        user.setCurrentStreak(3);
        user.setLongestStreak(3);

        service.processXpAndStreak(user, progressWithXp(0), 10);

        assertThat(user.getCurrentStreak()).isEqualTo(4);
    }

    @Test
    void streak_sameDay_doesNotChangeStreak() {
        var user = userWithXp(0);
        user.setLastActivityDate(LocalDate.now());
        user.setCurrentStreak(5);

        service.processXpAndStreak(user, progressWithXp(0), 10);

        assertThat(user.getCurrentStreak()).isEqualTo(5);
    }

    @Test
    void streak_missedDay_resetsStreakTo1() {
        var user = userWithXp(0);
        user.setLastActivityDate(LocalDate.now().minusDays(2));
        user.setCurrentStreak(10);

        service.processXpAndStreak(user, progressWithXp(0), 10);

        assertThat(user.getCurrentStreak()).isEqualTo(1);
    }

    @Test
    void streak_longestStreakUpdatedWhenBeaten() {
        var user = userWithXp(0);
        user.setLastActivityDate(LocalDate.now().minusDays(1));
        user.setCurrentStreak(5);
        user.setLongestStreak(5);

        service.processXpAndStreak(user, progressWithXp(0), 10);

        assertThat(user.getLongestStreak()).isEqualTo(6);
    }

    @Test
    void streak_longestStreakNotReducedWhenReset() {
        var user = userWithXp(0);
        user.setLastActivityDate(LocalDate.now().minusDays(5));
        user.setCurrentStreak(10);
        user.setLongestStreak(10);

        service.processXpAndStreak(user, progressWithXp(0), 10);

        assertThat(user.getCurrentStreak()).isEqualTo(1);
        assertThat(user.getLongestStreak()).isEqualTo(10);
    }

    // --- helpers ---

    private User userWithXp(int xp) {
        return User.builder()
                .email("test@test.com")
                .passwordHash("hash")
                .name("Test")
                .totalXp(xp)
                .currentLevel(1)
                .currentStreak(0)
                .longestStreak(0)
                .build();
    }

    private UserProgress progressWithXp(int xp) {
        return UserProgress.builder()
                .totalXpEarned(xp)
                .startedAt(java.time.Instant.now())
                .build();
    }
}
