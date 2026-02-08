const { handleSubmission } = require("../services/SubmissionService");
const { updateUserStreak } = require("../services/StreakService");

async function submitProblem(req, res) {
    const { problemId, isCorrect, difficulty, language } = req.body;
    const userId = req.user.id;

    const submission = await handleSubmission({
        userId,
        problemId,
        isCorrect,
        difficulty,
        language,
    });

    if(isCorrect === true){
        await updateUserStreak(userId);
    }

    res.status(201).json({ message: "Submission recorded successfully", success: true, data: submission });
}

module.exports = { submitProblem };