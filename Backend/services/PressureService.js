const Submission = require("../Models/Submission");

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

async function computeDynamicPressure(userId) {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const submissions = await Submission.find({
        userId, 
        createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: -1 });

    if (submissions.length === 0) {
        return {
            level: "low",
            score: 0,
            reason: "No recent activity",
        };
    }

    // Accuracy
    const correct = submissions.filter(s => s.isCorrect).length;
    const accuracy = correct / submissions.length;

    if (accuracy < 0.35) pressureScore += 3;
    else if (accuracy < 0.5) pressureScore += 2;

    // Difficulty Factor
    let difficultyScore = 0;

    submissions.forEach(s => {
        if (s.difficulty === "Hard") difficultyScore += 3;
        if (s.difficulty === "Medium") difficultyScore += 2;
        if (s.difficulty === "Easy") difficultyScore += 1;
    });

    const avgDifficulty = difficultyScore / submissions.length;

    if (avgDifficulty >= 2.5) pressureScore += 2;

    // Burst Detection
    if (submissions.length >= 5) {
        const latest = submissions[0].createdAt;
        const fifth = submissions[4].createdAt;

        const diffMinutes =
            (latest - fifth) / (1000 * 60);

        if (diffMinutes <= 30 && accuracy < 0.5) {
            pressureScore += 2;
        }
    }

    // Inactivity
    const lastSubmission = submissions[0];
    const inactiveHours =
        (now - lastSubmission.createdAt) /
        (1000 * 60 * 60);

    if (inactiveHours > 96) pressureScore += 3;
    else if (inactiveHours > 48) pressureScore += 2;

    // Classification
    let level = "low";

    if (pressureScore >= 7) level = "high";
    else if (pressureScore >= 4) level = "medium";

    return {
        level,
        score: pressureScore,
        breakdown: {
            accuracy,
            avgDifficulty,
            inactiveHours,
        },
    };
}

module.exports = { generatePressureSignal, computeDynamicPressure, };