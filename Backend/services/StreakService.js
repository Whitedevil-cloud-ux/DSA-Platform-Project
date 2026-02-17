const UserStreak = require("../Models/UserStreak");
const Submission = require("../Models/Submission");
const { getTodayDate } = require("../util/DateUtils");

function normalizeDate(date){
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

async function updateUserStreak(userId) {
    const today = normalizeDate(new Date());
    let streak = await UserStreak.findOne({ userId });
    if(!streak){
        streak = await UserStreak.create({
            userId,
            currentStreak: 1,
            longestStreak: 1, 
            lastActiveDate: today,
        });
        return streak;
    }
    if(streak.lastActiveDate){
        const lastActive = normalizeDate(streak.lastActiveDate);
        const diffDays = (today - lastActive)/(1000 * 60 * 60 * 24);
        if(diffDays === 0){
            return streak;
        }
        if(diffDays === 1){
            streak.currentStreak += 1;
        }else{
            streak.currentStreak = 1;
        }
    }else{
        streak.currentStreak = 1;
    }

    streak.lastActiveDate = today;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    await streak.save();
    return streak;
}

function detectMissedDayAndUpdateStreak(user) {
    const today = getTodayDate();
    if(!user.lastActiveDate){
        user.currentStreak = 1;
        user.maxStreak = 1;
        user.lastActiveDate = today;
        return { status: "first_day" };
    }

    if(user.lastActiveDate === today){
        return { status: "same_day" };
    }

    const last = new Date(user.lastActiveDate);
    const now = new Date(today);

    const diffDays = Math.floor((now-last) / (1000 * 60 * 60 * 24));
    if(diffDays === 1){
        user.currentStreak += 1;
        user.maxStreak = Math.max(user.maxStreak, user.currentStreak);
        user.lastActiveDate = today;
        return { status: "continued" };
    }
    if(diffDays > 1){
        const brokenStreak = user.currentStreak;
        user.maxStreak = 1;
        user.lastActiveDate = today;
        return { status: "missed", brokenStreak };
    }
}

async function computeStreakTrend(userId) {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

    const submissions = await Submission.find({
        userId,
        createdAt: { $gte: fourteenDaysAgo },
    });

    let currentWeekScore = 0;
    let previousWeekScore = 0;

    submissions.forEach(s => {
        const weight = s.difficulty === "Hard" ? 3 : s.difficulty === "Medium" ? 2 : 1;
        if(s.createdAt >= sevenDaysAgo){
            currentWeekScore += weight;
        }else{
            previousWeekScore += weight;
        }
    });
    let trend = "stable";
    if(currentWeekScore > previousWeekScore){
        trend = "up";
    }else if(currentWeekScore < previousWeekScore){
        trend = "down";
    }
    return {
        trend, 
        currentWeekScore,
        previousWeekScore,
        momentum: currentWeekScore - previousWeekScore,
    };
}

async function computeWeeklyConsistency(userId) {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const submissions = await Submission.find({
        userId,
        createdAt: { $gte: sevenDaysAgo },
    });

    const uniqueDays = new Set();
    submissions.forEach(s => {
        const date = new Date(s.createdAt);
        date.setHours(0, 0, 0, 0);
        uniqueDays.add(date.getTime());
    });
    const activeDays = uniqueDays.size;
    const percentage = Math.round((activeDays/7) * 100);
    let level = "weak";

    if (percentage >= 85) level = "excellent";
    else if (percentage >= 70) level = "good";
    else if (percentage >= 50) level = "moderate";

    return {
        activeDays,
        percentage,
        level,
    };
}

module.exports = { updateUserStreak, detectMissedDayAndUpdateStreak, computeStreakTrend, computeWeeklyConsistency, };