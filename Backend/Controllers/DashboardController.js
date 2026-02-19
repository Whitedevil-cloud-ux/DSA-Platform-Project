const Submission = require("../Models/Submission");

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

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions,
        correctSubmissions,
        accuracy,
        problemsSolved: solvedProblems.length,
        recentSubmissions,
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
