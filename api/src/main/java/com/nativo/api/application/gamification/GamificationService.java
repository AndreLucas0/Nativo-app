package com.nativo.api.application.gamification;

import com.nativo.api.domain.progress.UserProgress;
import com.nativo.api.domain.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class GamificationService {

    public void processXpAndStreak(User user, UserProgress userProgress, int xpReward) {
        user.setTotalXp(user.getTotalXp() + xpReward);
        userProgress.setTotalXpEarned(userProgress.getTotalXpEarned() + xpReward);

        int newLevel = (int) Math.floor(Math.sqrt(user.getTotalXp() / 100.0)) + 1;
        user.setCurrentLevel(newLevel);

        LocalDate today = LocalDate.now();
        LocalDate lastActivity = user.getLastActivityDate();

        if (lastActivity == null || lastActivity.isBefore(today.minusDays(1))) {
            user.setCurrentStreak(1);
        } else if (lastActivity.equals(today.minusDays(1))) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        }
        // lastActivity == today → streak already counted today, no change

        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }

        user.setLastActivityDate(today);
    }
}
