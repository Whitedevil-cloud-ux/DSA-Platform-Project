function generatePressureSignal(streakResult){
    const { status } = streakResult;
    if(status === "same_day" || status === "continued"){
        return null;
    }
    if(status === "first_day"){
        return {
            type: "FIRST_COMMIT",
            severity: "low",
        };
    }

    // Chain broken logic
    if(status === "missed"){
        const { brokenStreak, missedDays } = streakResult;
        let severity = "low";
        if(brokenStreak >= 7) severity = "high";
        else if(brokenStreak >= 3) severity = "medium";
        return {
            type: "CHAIN_BROKEN",
            severity,
            context: {
                brokenStreak,
                missedDays,
            },
        };
    }
    return null;
}

module.exports = { generatePressureSignal, };