const PressureEvent = require("../Models/PressureEvent");
const getTodayDate = require("../util/DateUtils");

async function detectComeback(userId) {
    const lastBreak = await PressureEvent.findOne({
        userId,
        type: "CHAIN_BROKEN",
        isConsumed: false,
    }).sort({ createdAt: -1 });

    if(!lastBreak){
        return null;
    }
    return {
        type: "COMEBACK",
        context: {
            brokenStreak: lastBreak.context?.brokenStreak || null,
            missedDays: lastBreak.context?.missedDays || null,
        },
        sourcePressureEventId: lastBreak._id,
    };
}

async function handleRecovery(user, comebackSignal) {
    if(!comebackSignal) return null;
    user.inRecovery = true;
    user.recoveryStreak = 1;

    return{
        type: "RECOVERY_STARTED",
        day: 1,
    };
}

function updateRecoveryProgress(user){
    if(!user.inRecovery) return null;
    user.recoveryStreak += 1;
    if(user.recoveryStreak >= 2){
        user.inRecovery = false;
        user.recoveryStreak = 0;
        // start cooldown (48 hours)
        user.pressureCooldonwUntil = new Date(Date.now() + 48 * 60 * 60 * 1000);
        return { type: "RECOVERY_ENDED" };
    }
    return {
        type: "RECOVERY_PROGRESS",
        day: user.recoveryStreak,
    };
}

module.exports = { detectComeback, handleRecovery, updateRecoveryProgress };