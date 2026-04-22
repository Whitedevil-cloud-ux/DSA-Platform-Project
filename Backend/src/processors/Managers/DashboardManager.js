const Submission = require("../../../Models/Submission");
const UserPatternProgress = require("../../../Models/UserPatternProgress");
const ApiError = require("../../../utils/ApiError");
const {
    buildPatternMastery,
    scorePatterns,
    buildDailyPlan,
    calculateInterviewReadiness,
} = require("../../../services/services/DashboardService");

class DashboardManager {
    static async getDashboardStats({ userId }) {
        if (!userId) {
            throw new ApiError(401, "User is required");
        }

        const totalSubmissions = await Submission.countDocuments({ userId });
        const correctSubmissions = await Submission.countDocuments({
            userId,
            isCorrect: true,
        });

        const accuracy =
            totalSubmissions === 0
                ? 0
                : Math.round((correctSubmissions / totalSubmissions) * 100);

        const solvedProblems = await Submission.distinct("problemId", {
            userId,
            isCorrect: true,
        });

        const recentSubmissions = await Submission.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("problemId", "title difficulty");

        const patternProgress = await UserPatternProgress.find({ userId })
            .populate("patternId", "name interviewWeight")
            .sort({ masteryScore: -1 });

        let patternMastery = await buildPatternMastery({
            userId,
            patternProgress,
        });

        if (patternMastery.length > 0) {
            patternMastery = scorePatterns(patternMastery);
        }

        const focusPattern = patternMastery.length > 0 ? patternMastery[0] : null;
        const dailyPlan =
            patternMastery.length > 0
                ? buildDailyPlan({ patternMastery, focusPattern })
                : [];

        return {
            totalSubmissions,
            correctSubmissions,
            accuracy,
            problemsSolved: solvedProblems.length,
            recentSubmissions,
            patternMastery,
            strongestPattern:
                patternMastery.length > 0 ? patternMastery[0] : null,
            weakestPattern:
                patternMastery.length > 0
                    ? patternMastery[patternMastery.length - 1]
                    : null,
            focusPattern,
            dailyPlan,
            interviewReadiness: calculateInterviewReadiness(patternMastery),
        };
    }
}

module.exports = DashboardManager;
