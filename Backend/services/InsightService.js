const User = require("../Models/User");
const UserStreak = require("../Models/UserStreak");
const { computeDynamicPressure } = require("./PressureService");
const { computeStreakTrend, computeWeeklyConsistency } = require("./StreakService");
const { orchestrateResponse } = require("./ResponseOrchestratorService");
const { mapIntentToMessage } = require("./MessageMapper");

async function getUserInsights(userId) {
    const user = await User.findById(userId);
    if(!user) throw new Error("User not found");

    const streak = await UserStreak.findOne({ userId });

    const [
        dynamicPressure,
        streakTrend,
        weeklyConsistency
        ] = await Promise.all([
        computeDynamicPressure(userId),
        computeStreakTrend(userId),
        computeWeeklyConsistency(userId),
    ]);
    const decision = orchestrateResponse({
        dynamicPressure,
        streakTrend,
        weeklyConsistency,
        recoverySignal: null,
    });

    const uiMessage = decision?.intent ? mapIntentToMessage(decision.intent) : null;
    return {
        streak: {
            current: streak?.currentStreak || 0,
            longest: streak?.longestStreak || 0,
        },
        pressure: dynamicPressure,
        momentum: streakTrend,
        consistency: weeklyConsistency,
        intent: decision,
        uiMessage,
    };
}

module.exports = { getUserInsights };