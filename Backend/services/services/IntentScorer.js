function scoreIntents(signals){
    const scores = {
        STABILIZE: 0,
        PUSH: 0,
        REINFORCE: 0,
        RECOVER: 0,
        MAINTAIN: 0,
        SILENT: 0,
    };

    const {
        pressureLevel = 0,
        streakTrend = "stable",
        lastActiveHours = 0,
        difficultyShift = "same",
        weeklyConsistency = 50,
    } = signals;

    if(pressureLevel >= 4) scores.STABILIZE += 3;
    else if(pressureLevel === 3) scores.STABILIZE += 1;

    if(streakTrend === "up") scores.REINFORCE += 2;
    if(streakTrend === "down") scores.STABILIZE += 3;

    if(lastActiveHours > 24) scores.RECOVER += 3;
    else if(lastActiveHours > 12) scores.RECOVER += 1;

    if(difficultyShift === "higher") scores.PUSH += 2;
    if(difficultyShift === "lower") scores.STABILIZE += 1;

    if(weeklyConsistency > 80) scores.MAINTAIN += 2;
    if(weeklyConsistency < 40) scores.MAINTAIN += 1;

    const dominantIntent = resolveDominantIntent(scores);
    return {
        dominantIntent,
        intentScores: scores,
    };
}

function resolveDominantIntent(scores){
    const priorityOrder = ["STABILIZE", "RECOVER", "PUSH", "REINFORCE", "MAINTAIN"];
    let maxScore = Math.max(...Object.values(scores));
    if(maxScore === 0) return "SILENT";
    for(let intent of priorityOrder){
        if(scores[intent] === maxScore){
            return intent;
        }
    }
    return "SILENT";
}

module.exports = { scoreIntents, };