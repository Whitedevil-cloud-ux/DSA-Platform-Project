const UserStreak = require("../Models/UserStreak");

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

module.exports = { updateUserStreak };