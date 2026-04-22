const Submission = require("../../Models/Submission");
const Problem = require("../../Models/Problem");
const User = require("../../Models/User");
const submissionQueue = require("../../src/queues/submissionQueue");

async function handleSubmission({
    userId,
    problemId,
    isCorrect,
    difficulty,
    language,
    confidence,
}) {
    const user = await User.findById(userId);
    if(!user){
        throw new Error("User not found");
    }
    const recentSubmission = await Submission.findOne({
        userId, 
        problemId,
    }).sort({ createdAt: -1 });
    if(recentSubmission) {
        const timeDiff = Date.now() - new Date(recentSubmission.createdAt).getTime();
        if(timeDiff < 3000){
            const error = new Error("Duplicate submission detected");
            error.statusCode = 429;
            throw error;
        }
    }

    // Create submission
    const submission = await Submission.create({
        userId,
        problemId,
        isCorrect,
        difficulty,
        language,
        confidence,
    });

    // Emit event instead of doing everything here
    await submissionQueue.add("submission.created", {
        userId,
        problemId,
        isCorrect,
        difficulty,
        confidence,
        submissionId: submission._id,
    });

    console.log(`\n📤 [SERVICE] Submission event emitted:`, {
        submissionId: submission._id,
        userId,
        problemId,
        isCorrect,
        message: "Background job queued for processing"
    });

    return { success: true };
}

async function updatePatternProgress({
    userId,
    pattern,
    isCorrect,
    difficulty,
}) {
    let progress = await UserPatternProgress.findOne({
        userId,
        patternId: pattern._id,
    });
    if(!progress){
        progress = await UserPatternProgress.create({
            userId,
            patternId: pattern._id,
        });
    }

    // Update attempts
    progress.problemsAttempted += 1;
    progress.lastPracticedAt = new Date();
    if(isCorrect){
        progress.problemsSolved  += 1;
        if(difficulty === "Easy") progress.easySolved += 1;
        if(difficulty === "Medium") progress.mediumSolved += 1;
        if(difficulty === "Hard") progress.hardSolved += 1;
    }
    
    // Recalculate Mastery
    const { masteryScore, confidenceLevel, accuracy } = calculateMasteryScore({
        easySolved: progress.easySolved,
        mediumSolved: progress.mediumSolved,
        hardSolved: progress.hardSolved,
        problemsSolved: progress.problemsSolved,
        problemsAttempted: progress.problemsAttempted,
        lastPracticedAt: progress.lastPracticedAt,
        interviewWeight: pattern.interviewWeight,
    });

    progress.masteryScore = masteryScore;
    progress.confidenceLevel = confidenceLevel;
    progress.accuracy = accuracy;

    await progress.save();
}

async function updateSubmissionConfidence({
    userId,
    submissionId,
    confidence,
}) {
    console.log("PATCH HIT");
    console.log("Submission ID:", submissionId);
    console.log("Confidence:", confidence);

    const updated = await Submission.findOneAndUpdate(
        { _id: submissionId, userId },
        { confidence },
        { new: true }
    );

    console.log("Updated doc:", updated);

    if (!updated) {
        const error = new Error("Submission not found");
        error.statusCode = 404;
        throw error;
    }

    return updated;
}


module.exports = { handleSubmission, updateSubmissionConfidence };