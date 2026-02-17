const UserPatternProgress = require("../Models/UserPatternProgress");

function formatPattern(p) {
    return {
        id: p.patternId?._id,
        name: p.patternId?.name,
        masteryScore: p.masteryScore,
        accuracy: p.accuracy,
        confidence: p.confidenceLevel,
        lastPracticedAt: p.lastPracticedAt
    };
}
async function getPatternInsights(userId) {
    const progressList = await UserPatternProgress.find({ userId })
        .populate("patternId", "name category")
        .select("patternId masteryScore accuracy confidenceLevel lastPracticedAt");

    if (!progressList.length) {
        return {
            topPatterns: [],
            weakPatterns: [],
            improvingPatterns: [],
            overallMastery: 0,
            confidenceDistribution: { high: 0, medium: 0, low: 0 }
        };
    }

    const sortedByMastery = [...progressList].sort(
        (a, b) => b.masteryScore - a.masteryScore
    );

    const topPatterns = sortedByMastery.slice(0, 3);
    const weakPatterns = sortedByMastery.slice(-3).reverse();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const improvingPatterns = progressList.filter(p =>
        p.lastPracticedAt &&
        p.lastPracticedAt >= sevenDaysAgo &&
        p.accuracy >= 60
    );

    const totalMastery = progressList.reduce(
        (sum, p) => sum + p.masteryScore,
        0
    );

    const overallMastery =
        Math.round(totalMastery / progressList.length);

    const confidenceDistribution = {
        high: 0,
        medium: 0,
        low: 0
    };

    progressList.forEach(p => {
        if (confidenceDistribution[p.confidenceLevel] !== undefined) {
            confidenceDistribution[p.confidenceLevel]++;
        }
    });

    return {
        topPatterns: topPatterns.map(formatPattern),
        weakPatterns: weakPatterns.map(formatPattern),
        improvingPatterns: improvingPatterns.map(formatPattern),
        overallMastery,
        confidenceDistribution
    };
}

module.exports = { getPatternInsights }; 