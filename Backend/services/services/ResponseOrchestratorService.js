function orchestrateResponse({
    dynamicPressure,
    streakTrend,
    weeklyConsistency,
    recoverySignal,
}) {
    // Priority 1 : Recovery State
    if(recoverySignal){
        return { intent: "RECOVER" };
    }

    // Priority 2 : High Pressure + Down Trend
    if(dynamicPressure?.level === "high" && streakTrend?.trend === "down"){
        return { intent: "STABILIZE" };
    }

    // High pressure + good consistency
    if(dynamicPressure?.level === "high" && weeklyConsistency?.level === "good"){
        return { intent: "MAINTAIN" };
    }

    // Up trend + good consistency
    if(streakTrend?.trend === "up" && weeklyConsistency?.level !== "weak"){
        return { intent: "PUSH" };
    }

    // Weak Consistency
    if (weeklyConsistency?.level === "weak") {
        return { intent: "STABILIZE" };
    }

    // Default Neutral
    return { intent: "SILENT" };
}

module.exports = { orchestrateResponse, };