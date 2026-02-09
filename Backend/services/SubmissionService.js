const Submission = require("../Models/Submission");
const Problem = require("../Models/Problem");
const User = require("../Models/User");
const UserPatternProgress = require("../Models/UserPatternProgress");
const Pattern = require("../Models/Pattern");
const PressureEvent = require("../Models/PressureEvent");
const { calculateMasteryScore } = require("./MasteryScoreService");
const { detectMissedDayAndUpdateStreak } = require("./StreakService");
const { generatePressureSignal } = require("./PressureService");
const { shouldTriggerResponse } = require("./pressureHookService");
const { detectComeback, handleRecovery, updateRecoveryProgress } = require("./recoveryService");

async function handleSubmission({
    userId,
    problemId,
    isCorrect,
    difficulty,
    language,  
}) {
    const user = await User.findById(userId);
    if(!user){
        throw new Error("User not found");
    }
    const streakResult = detectMissedDayAndUpdateStreak(user);
    const pressureSignal = generatePressureSignal(streakResult);
    let shouldNudge = false;
    if(user.inRecovery){
        shouldNudge = shouldTriggerResponse(user, pressureSignal);
        if(shouldNudge){
            user.lastPressureAt = new Date();
        }
    }
    if(shouldNudge && pressureSignal){
        await PressureEvent.create({
            userId: user._id,
            type: pressureSignal.type,
            severity: pressureSignal.severity,
            context: pressureSignal.context || {},
        });
    }

    const submission = await Submission.create({
        userId,
        problemId,
        isCorrect,
        difficulty,
        language,
    });
    const comebackSignal = await detectComeback(user._id);
    if(comebackSignal){
        await handleRecovery(user, comebackSignal);
        // consume chain break event
        await PressureEvent.findByIdAndUpdate(comebackSignal.sourcePressureEventId, { isConsumed: true });
    }else{
        updateRecoveryProgress(user);
    }
    
    await user.save();

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
    return { submission, streakResult, pressureSignal, shouldNudge, };
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