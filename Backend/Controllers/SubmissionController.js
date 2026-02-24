const { handleSubmission, updateSubmissionConfidence } = require("../services/SubmissionService");
const { updateUserStreak } = require("../services/StreakService");
const Submission = require("../Models/Submission");

async function submitProblem(req, res) {
    try {
        const { problemId, isCorrect, difficulty, language, confidence } = req.body;
        const userId = req.user.id;

        const submission = await handleSubmission({
            userId,
            problemId,
            isCorrect,
            difficulty,
            language,
            confidence,
        });

        if(isCorrect === true){
            await updateUserStreak(userId);
        }

        res.status(201).json({ 
            message: "Submission recorded successfully", 
            success: true, 
            data: submission });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
    
}

async function getProblemSubmissions(req, res) {
    try {
        const { problemId } = req.params;
        const userId = req.user.id;

        const submissions = await Submission.find({
            userId,
            problemId,
        }).sort({ createdAt: -1 }).limit(20).select("isCorrect difficulty language createdAt");
        res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch submissions",
        });
    }
}

async function updateConfidence(req, res) {
    try {
        const { submissionId } = req.params;
        const { confidence } = req.body;
        const userId = req.user.id;
        
        const updated = await updateSubmissionConfidence({
            userId,
            submissionId,
            confidence,
        });

        res.status(200).json({
            success: true,
            message: "Confidence updated successfully",
            data: updated,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update confidence",
        });
    }
}

module.exports = { submitProblem, getProblemSubmissions, updateConfidence };