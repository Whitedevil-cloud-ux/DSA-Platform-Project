const User = require("../../Models/User");
const { detectMissedDayAndUpdateStreak } = require("./StreakService");

const updateUserActivity = async (userId) => {
    const today = new Date().toISOString().split("T")[0];

    const user = await User.findById(userId);

    // Update active days
    if(!user.daysActive) user.daysActive = [];

    // Streak logic
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    detectMissedDayAndUpdateStreak(user);

    user.lastActiveDate = today;

    await user.save();
};

module.exports = { updateUserActivity };