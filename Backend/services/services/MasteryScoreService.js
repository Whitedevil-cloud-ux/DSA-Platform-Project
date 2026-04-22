// Calculate mastery score and confidence level based on user-pattern progress and pattern metadata

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getRecencyFactor(lastPracticedAt){
    if(!lastPracticedAt) return 0.5;

    const daySincePractice = Math.floor(
        (Date.now() - new Date(lastPracticedAt))/ DAY_IN_MS
    );
    if(daySincePractice <= 7) return 1.0;
    if(daySincePractice <= 15) return 0.85;
    if(daySincePractice <= 30) return 0.7;
    return 0.5;
}

function getConsistencyScore(daysActive = 0){
    // last 7 days activity
    return Math.min(daysActive / 7, 1);
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
    daysActive = 0,
}) {
    const accuracy = problemsAttempted > 0 ? problemsSolved / problemsAttempted : 0;
    const totalSolved = easySolved + mediumSolved + hardSolved || 1;
    const difficultyScore = (easySolved * 0.5 + mediumSolved * 1 + hardSolved * 1.5)/totalSolved; 
    const recencyScore = getRecencyFactor(lastPracticedAt);
    const volumeScore = Math.min(problemsSolved / 50, 1);
    const consistencyScore = getConsistencyScore(daysActive);
    const attemptRatio = problemsAttempted > 0 ? problemsAttempted / (problemsSolved || 1) : 1;
    const penaltyScore = Math.max(1-(attemptRatio - 1) * 0.2, 0);
    
    let score = (accuracy * 0.25) + (difficultyScore * 0.20) + (recencyScore * 0.15) + (volumeScore * 0.10) + (consistencyScore * 0.15) + (penaltyScore * 0.15);
    score = score * (0.8 + interviewWeight / 20);

    const masteryScore = Math.round(score * 100);
    return {
        masteryScore,
        confidenceLevel: getConfidenceLevel(masteryScore),
        breakdown: {
            accuracy: +accuracy.toFixed(2),
            difficultyScore: +difficultyScore.toFixed(2),
            recencyScore: +recencyScore.toFixed(2),
            consistencyScore: +consistencyScore.toFixed(2),
            penaltyScore: +penaltyScore.toFixed(2),
        }
    };
}

module.exports = { calculateMasteryScore };