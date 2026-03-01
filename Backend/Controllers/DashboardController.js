const Submission = require("../Models/Submission");
const UserPatternProgress = require("../Models/UserPatternProgress");
const Pattern = require("../Models/Pattern");
const Problem = require("../Models/Problem");

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

    let patternMastery = await Promise.all(
      patternProgress.map(async (item) => {
        const patternId = item.patternId?._id;
        const problemsWithPattern = await Problem.find({
          patterns: patternId,
        }).select("_id");
        const problemIds = problemsWithPattern.map((p) => p._id);

        // Last 5 submissions
        const recentSubs = await Submission.find({
          userId,
          problemId: { $in: problemIds },
        })
        .sort({ createdAt: -1 })
        .limit(5);

        let recentAccuracy = 0;
        if(recentSubs.length > 0){
          const recentCorrect = recentSubs.filter((s) => s.isCorrect).length;
          recentAccuracy = recentCorrect/recentSubs.length;
        }
        const overallAccuracy = item.accuracy;
        let trend = "stable";
        if(recentAccuracy > overallAccuracy + 0.05){
          trend = "improving";
        }else if(recentAccuracy < overallAccuracy - 0.05){
          trend = "declining";
        }
        const isAtRisk = item.masteryScore < 40 && trend === "declining";

        return {
          pattern: item.patternId?.name || "Unknown",
          masteryScore: item.masteryScore,
          interviewWeight: item.patternId?.interviewWeight || 0,
          accuracy: overallAccuracy,
          confidenceLevel: item.confidenceLevel,
          problemsSolved: item.problemsSolved,
          problemsAttempted: item.problemsAttempted,
          trend,
          isAtRisk,
          lastPracticedAt: item.lastPracticedAt,
        };
      })
    );

    let focusPattern = null;

    if(patternMastery.length > 0){
      const scoredPatterns = patternMastery.map((item) => {
        let trendPenalty = 0;
        if(item.trend === "declining") trendPenalty = 15;
        if(item.trend === "improving") trendPenalty = -5;

        // Recency penalty (if last practiced > 7 days ago)
        let recencyPenalty = 0;
        const now = new Date();
        const lastPracticed = patternProgress.find(
          (p) => p.patternId?.name === item.pattern
        )?.lastPracticedAt;

        if(lastPracticed){
          const daysDiff = (now - new Date(lastPracticed)) / (1000 * 60 * 60 * 24);
          if(daysDiff > 7) recencyPenalty = 10;
        }
        const focusScore = 
          (100 - item.masteryScore) * 0.5 +
          item.interviewWeight * 8 +
          trendPenalty + 
          recencyPenalty;

        return { ...item, focusScore };
      });
      scoredPatterns.sort((a, b) => b.focusScore - a.focusScore);

      patternMastery = scoredPatterns;
      focusPattern = scoredPatterns[0];
    }

    let dailyPlan = [];
    if(patternMastery.length > 0) {
      const atRiskPattern = patternMastery.find(p => p.isAtRisk);
      if(atRiskPattern){
        dailyPlan.push({
          pattern: atRiskPattern.pattern,
          task: "Solve 3 problems",
          reason: "Pattern is declining and at risk",
        });
      }

      if(focusPattern){
        dailyPlan.push({
          pattern: focusPattern.pattern,
          task: "Solve 2 problems",
          reason: "High priority based on mastery and interview weight",
        });
      }
      const improvingPattern = patternMastery
        .filter(p => p.trend === "improving")
        .sort((a, b) => b.masteryScore - a.masteryScore)[0];

      if(improvingPattern) {
        dailyPlan.push({
          pattern: improvingPattern.pattern,
          task: "Revise 1 problem",
          reason: "Maintain momentum in improving pattern",
        });
      }
    }

    let interviewReadiness = 0;
    if(patternMastery.length > 0){
      let totalWeightedScore = 0;
      let totalWeight = 0;
      let penalty = 0;

      patternMastery.forEach((item) => {
        totalWeightedScore += item.masteryScore * item.interviewWeight;
        totalWeight += item.interviewWeight;

        if(item.trend === "declining") penalty += 5;
        if(item.isAtRisk) penalty += 10;
        if(item.confidenceLevel === "low") penalty += 5;
      });

      const weightedAverage = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
      const adjustmentFactor = 1-penalty/100;
      interviewReadiness = weightedAverage * adjustmentFactor;

      if(interviewReadiness < 0) interviewReadiness = 0;
      if(interviewReadiness > 100) interviewReadiness = 100;

      interviewReadiness = Math.round(interviewReadiness);
    }

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
        focusPattern,
        dailyPlan,
        interviewReadiness,
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
