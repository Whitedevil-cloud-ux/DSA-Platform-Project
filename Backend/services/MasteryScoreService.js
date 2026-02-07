// Calculate mastery score and confidence level based on user-pattern progress and pattern metadata

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getRecencyFactor(lastPracticedAt){
    if(!lastPracticedAt) return 0.6;

    const daySincePractice = Math.floor(
        (Date.now() - new Date(lastPracticedAt))/ DAY_IN_MS
    );
    if(daySincePractice <= 7) return 1.0;
    if(daySincePractice <= 15) return 0.9;
    if(daySincePractice <= 30) return 0.75;
    return 0.6;
}

function getConfidenceLevel(masteryScore){
    if(masteryScore >= 71) return "high";
    if(masteryScore >= 31) return "medium";
    return "low";
}

function calculateMasteryScore({
    easySolved = 0,
    mediumSolved = 0,
    hardSolved = 0,
    problemsSolved = 0,
    problemsAttempted = 0,
    lastPracticedAt,
    interviewWeight = 5,
}) {
    const baseScore = easySolved * 1 + mediumSolved * 2 + hardSolved * 3;
    const accuracy = problemsAttempted > 0 ? problemsSolved / problemsAttempted : 0;
    const accuracyMultiplier = Math.min(Math.max(accuracy, 0), 1);
    const recencyFactor = getRecencyFactor(lastPracticedAt);
    const interviewFactor = interviewWeight / 10;
    
    let masteryScore = baseScore * accuracyMultiplier * recencyFactor * interviewFactor;

    masteryScore = Math.min(Math.round(masteryScore * 10), 100);

    const confidenceLevel = getConfidenceLevel(masteryScore);
    return {
        masteryScore,
        confidenceLevel,
        accuracy: Number(accuracyMultiplier.toFixed(2)),
    };
}

module.exports = { calculateMasteryScore };