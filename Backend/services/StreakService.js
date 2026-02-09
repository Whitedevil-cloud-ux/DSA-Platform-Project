const UserStreak = require("../Models/UserStreak");
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

module.exports = { updateUserStreak, detectMissedDayAndUpdateStreak, };