const Submission = require("../Models/Submission");
const UserPatternProgress = require("../Models/UserPatternProgress");
const Pattern = require("../Models/Pattern");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

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

    const patternMastery = patternProgress.map((item) => ({
      pattern: item.patternId?.name || "Unknown",
      masteryScore: item.masteryScore,
      accuracy: item.accuracy,
      confidenceLevel: item.confidenceLevel,
      problemsSolved: item.problemsSolved,
      problemsAttempted: item.problemsAttempted,
    }));

    const strongestPattern = patternMastery.length > 0
        ? patternMastery[0] 
        : null;
    
    const weakestPattern = patternMastery.length > 0
        ? patternMastery[patternMastery.length - 1]
        : null;

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        correctSubmissions,
        accuracy,
        problemsSolved: solvedProblems.length,
        recentSubmissions,
        patternMastery,
        strongestPattern,
        weakestPattern,
      },
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

module.exports = { getDashboardStats };
