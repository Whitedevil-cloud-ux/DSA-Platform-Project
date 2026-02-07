const Submission = require("../Models/Submission");
const Problem = require("../Models/Problem");
const UserPatternProgress = require("../Models/UserPatternProgress");
const Pattern = require("../Models/Pattern");
const { calculateMasteryScore } = require("./MasteryScoreService");

async function handleSubmission({
    userId,
    problemId,
    isCorrect,
    difficulty,
    language,  
}) {
    const submission = await Submission.create({
        userId,
        problemId,
        isCorrect,
        difficulty,
        language,
    });

    const problem = await Problem.findById(problemId).populate("patterns");
    if(!problem){
        throw new Error("Problem not found");
    }
    for(const pattern of problem.patterns){
        await updatePatternProgress({
            userId,
            pattern,
            isCorrect,
            difficulty,
        });
    }
    return submission;
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

module.exports = { handleSubmission };