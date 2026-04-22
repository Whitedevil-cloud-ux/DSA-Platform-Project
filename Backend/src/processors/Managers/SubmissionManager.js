// It handles the business logic and orchestrate services and database operations

const { handleSubmission, updateSubmissionConfidence, updateUserActivity } = require("../../../services/services/SubmissionService");
const { updateUserStreak } = require("../../../services/services/StreakService");
const Submission = require("../../../Models/Submission");
const ApiError = require("../../../utils/ApiError");

class SubmissionManager {
    static async submitProblem({ userId, problemId, isCorrect, difficulty, language, confidence }) {
        if(!problemId) {
            throw new ApiError(400, "Problem Id is required");
        }
        const submission = await handleSubmission({
            userId,
            problemId,
            isCorrect,
            difficulty,
            language,
            confidence,
        });

        await updateUserActivity(userId);
        if(isCorrect == true){
            await updateUserStreak(userId);
        }
        return submission;
    }

    static async getProblemSubmissions({ userId, problemId }){
        if(!problemId){
            throw new ApiError(400, "Problem ID is required");
        }
        const submissions = await Submission.find({
            userId,
            problemId,
        })
        .sort({ createdAt: -1 })
        .limit(20)
        .select("isCorrect difficulty language createdAt");

        return submissions;
    }

    static async updateConfidence({ userId, submissionId, confidence }){
        if(!submissionId) {
            throw new ApiError(400, "Submission Id is required");
        }

        return await updateSubmissionConfidence({
            userId,
            submissionId,
            confidence,
        });
    }
}

module.exports = SubmissionManager;