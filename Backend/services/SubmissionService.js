const Submission = require("../Models/Submission");
const Problem = require("../Models/Problem");
const User = require("../Models/User");
const UserPatternProgress = require("../Models/UserPatternProgress");
const Pattern = require("../Models/Pattern");
const PressureEvent = require("../Models/PressureEvent");
const { calculateMasteryScore } = require("./MasteryScoreService");
const { detectMissedDayAndUpdateStreak, computeStreakTrend, computeWeeklyConsistency } = require("./StreakService");
const { generatePressureSignal, computeDynamicPressure } = require("./PressureService");
const { shouldTriggerResponse } = require("./pressureHookService");
const { detectComeback, handleRecovery, updateRecoveryProgress } = require("./recoveryService");
const { generateReinforcementSignal } = require("./reinforcementService");
const { orchestrateResponse } = require("./ResponseOrchestratorService");
const { mapIntentToMessage } = require("./MessageMapper");

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

    // Create submission
    const submission = await Submission.create({
        userId,
        problemId,
        isCorrect,
        difficulty,
        language,
    });

    // Detect comeback & recovery first
    const comebackSignal = await detectComeback(user._id);
    let recoverySignal = null;

    if (comebackSignal) {
        recoverySignal = await handleRecovery(user, comebackSignal);

        await PressureEvent.findByIdAndUpdate(
            comebackSignal.sourcePressureEventId,
            { isConsumed: true }
        );
    } else {
        recoverySignal = updateRecoveryProgress(user);
    }

    // Compute behavioral analytics AFTER recovery update
    const dynamicPressure = await computeDynamicPressure(userId);

    if (dynamicPressure.level === "high") {
        await PressureEvent.create({
            userId,
            type: "BEHAVIORAL_PRESSURE",
            severity: "high",
            context: dynamicPressure.breakdown,
        });
    }

    const streakTrend = await computeStreakTrend(userId);
    const weeklyConsistency = await computeWeeklyConsistency(userId);

    // Orchestrate response (NOW recoverySignal exists)
    const finalResponse = orchestrateResponse({
        dynamicPressure,
        streakTrend,
        weeklyConsistency,
        recoverySignal,
    });
    
    const uiMessage = finalResponse?.intent
    ? mapIntentToMessage(finalResponse.intent)
    : null;

    const reinforcementSignal = generateReinforcementSignal(user, recoverySignal);

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
    return { 
        submission, 
        signals: {
            dynamicPressure,
            streakTrend,
            weeklyConsistency,
        },
        decision: finalResponse,
        uiMessage,
    };
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