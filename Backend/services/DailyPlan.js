const UserPatternProgress = require("../Models/UserPatternProgress");
const Problem = require("../Models/Problem");

async function getWeakPatterns(userId, limit=3) {
    const progressDocs = await UserPatternProgress.find({ userId }).populate("patternId");

    const scoredPatterns = progressDocs.map((doc) => {
        const lastSolved = doc.lastSolvedAt ? new Date(doc.lastSolvedAt) : new Date(0);
        const daysSinceLastSolved = (Date.now() - lastSolved.getTime()) / ( 1000 * 60 * 60 * 24 );
        const mastery = doc.mastery ?? 0;
        const accuracy = doc.accuracy ?? 0;
        const weaknessScore = (1 - mastery) * 0.6 + daysSinceLastSolved * 0.3 + (1 - accuracy) * 0.1;
        const interviewWeight = doc.patternId?.interviewWeight ?? 3;
        return {
            pattern: doc.patternId,
            weaknessScore: weaknessScore * interviewWeight,
        };
    });

    return scoredPatterns.sort((a, b) => b.weaknessScore - a.weaknessScore).slice(0, limit);
}

async function generateDailyPlan(userId) {
    const weakPatterns = await getWeakPatterns(userId, 3);
    const dailyPlan = [];
    for(const item of weakPatterns){
        const problems = await Problem.find({
            patternId: item.pattern._id,
        })
        .limit(2)
        .select("title difficulty link patternId");

        dailyPlan.push({
            pattern: {
                id: item.pattern._id,
                name: item.pattern.name,
            },
            problems,
        });
    }
    return dailyPlan;
}
module.exports = { getWeakPatterns, generateDailyPlan, };