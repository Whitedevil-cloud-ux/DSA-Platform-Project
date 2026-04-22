const Submission = require("../../Models/Submission");
const Problem = require("../../Models/Problem");

function calculateTrend(recentAccuracy, overallAccuracy) {
    if (recentAccuracy > overallAccuracy + 0.05) {
        return "improving";
    }

    if (recentAccuracy < overallAccuracy - 0.05) {
        return "declining";
    }

    return "stable";
}

async function buildPatternMastery({ userId, patternProgress }) {
    return Promise.all(
        patternProgress.map(async (item) => {
            const patternId = item.patternId?._id;
            const problemsWithPattern = await Problem.find({
                patterns: patternId,
            }).select("_id");

            const problemIds = problemsWithPattern.map((problem) => problem._id);
            const recentSubmissions = await Submission.find({
                userId,
                problemId: { $in: problemIds },
            })
                .sort({ createdAt: -1 })
                .limit(5);

            let recentAccuracy = 0;
            if (recentSubmissions.length > 0) {
                const recentCorrect = recentSubmissions.filter(
                    (submission) => submission.isCorrect
                ).length;
                recentAccuracy = recentCorrect / recentSubmissions.length;
            }

            const overallAccuracy = item.accuracy;
            const trend = calculateTrend(recentAccuracy, overallAccuracy);

            return {
                pattern: item.patternId?.name || "Unknown",
                masteryScore: item.masteryScore,
                interviewWeight: item.patternId?.interviewWeight || 0,
                accuracy: overallAccuracy,
                confidenceLevel: item.confidenceLevel,
                problemsSolved: item.problemsSolved,
                problemsAttempted: item.problemsAttempted,
                trend,
                isAtRisk: item.masteryScore < 40 && trend === "declining",
                lastPracticedAt: item.lastPracticedAt,
            };
        })
    );
}

function scorePatterns(patternMastery) {
    const now = new Date();

    return patternMastery
        .map((item) => {
            let trendPenalty = 0;
            if (item.trend === "declining") {
                trendPenalty = 15;
            } else if (item.trend === "improving") {
                trendPenalty = -5;
            }

            let recencyPenalty = 0;
            if (item.lastPracticedAt) {
                const daysDiff =
                    (now - new Date(item.lastPracticedAt)) / (1000 * 60 * 60 * 24);
                if (daysDiff > 7) {
                    recencyPenalty = 10;
                }
            }

            const focusScore =
                (100 - item.masteryScore) * 0.5 +
                item.interviewWeight * 8 +
                trendPenalty +
                recencyPenalty;

            return {
                ...item,
                focusScore,
            };
        })
        .sort((a, b) => b.focusScore - a.focusScore);
}

function buildDailyPlan({ patternMastery, focusPattern }) {
    const dailyPlan = [];
    const atRiskPattern = patternMastery.find((item) => item.isAtRisk);

    if (atRiskPattern) {
        dailyPlan.push({
            pattern: atRiskPattern.pattern,
            task: "Solve 3 problems",
            reason: "Pattern is declining and at risk",
        });
    }

    if (focusPattern) {
        dailyPlan.push({
            pattern: focusPattern.pattern,
            task: "Solve 2 problems",
            reason: "High priority based on mastery and interview weight",
        });
    }

    const improvingPattern = patternMastery
        .filter((item) => item.trend === "improving")
        .sort((a, b) => b.masteryScore - a.masteryScore)[0];

    if (improvingPattern) {
        dailyPlan.push({
            pattern: improvingPattern.pattern,
            task: "Revise 1 problem",
            reason: "Maintain momentum in improving pattern",
        });
    }

    return dailyPlan;
}

function calculateInterviewReadiness(patternMastery) {
    if (patternMastery.length === 0) {
        return 0;
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;
    let penalty = 0;

    patternMastery.forEach((item) => {
        totalWeightedScore += item.masteryScore * item.interviewWeight;
        totalWeight += item.interviewWeight;

        if (item.trend === "declining") {
            penalty += 5;
        }

        if (item.isAtRisk) {
            penalty += 10;
        }

        if (item.confidenceLevel === "low") {
            penalty += 5;
        }
    });

    const weightedAverage = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    const adjustmentFactor = 1 - penalty / 100;

    return Math.round(
        Math.max(0, Math.min(100, weightedAverage * adjustmentFactor))
    );
}

module.exports = {
    buildPatternMastery,
    scorePatterns,
    buildDailyPlan,
    calculateInterviewReadiness,
};
