const { Worker } = require('bullmq');
const submissionQueue = require('../queues/submissionQueue');
const User = require('../../Models/User');
const Problem = require('../../Models/Problem');
const UserPatternProgress = require('../../Models/UserPatternProgress');
const Pattern = require('../../Models/Pattern');
const PressureEvent = require('../../Models/PressureEvent');
const { calculateMasteryScore } = require('../../services/services/MasteryScoreService');
const { detectMissedDayAndUpdateStreak, computeStreakTrend, computeWeeklyConsistency, updateUserStreak } = require('../../services/services/StreakService');
const { generatePressureSignal, computeDynamicPressure } = require('../../services/services/PressureService');
const { shouldTriggerResponse } = require('../../services/services/pressureHookService');
const { detectComeback, handleRecovery, updateRecoveryProgress } = require('../../services/services/recoveryService');
const { generateReinforcementSignal } = require('../../services/services/reinforcementService');
const { orchestrateResponse } = require('../../services/services/ResponseOrchestratorService');
const { mapIntentToMessage } = require('../../services/services/MessageMapper');
const { updateUserActivity } = require('../../services/services/ActivityService');

const worker = new Worker('submission', async (job) => {
  const { userId, problemId, isCorrect, difficulty, confidence, submissionId } = job.data;
  
  console.log(`\n🔄 [WORKER] Processing submission job:`, {
    jobId: job.id,
    userId,
    problemId,
    isCorrect,
    difficulty,
    confidence,
    submissionId,
  });

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    console.log(`✓ [WORKER] User found: ${user._id}`);

    const streakResult = detectMissedDayAndUpdateStreak(user);
    console.log(`✓ [WORKER] Streak result:`, streakResult);
    
    const pressureSignal = generatePressureSignal(streakResult);
    console.log(`✓ [WORKER] Pressure signal generated`);
    
    let shouldNudge = false;
    if (user.inRecovery) {
      shouldNudge = shouldTriggerResponse(user, pressureSignal);
      if (shouldNudge) {
        user.lastPressureAt = new Date();
      }
    }
    if (shouldNudge && pressureSignal) {
      await PressureEvent.create({
        userId: user._id,
        type: pressureSignal.type,
        severity: pressureSignal.severity,
        context: pressureSignal.context || {},
      });
      console.log(`✓ [WORKER] Pressure event created`);
    }

    await updateUserActivity(userId);
    console.log(`✓ [WORKER] User activity updated`);

    if (isCorrect) {
      await updateUserStreak(userId);
      console.log(`✓ [WORKER] Streak updated`);
    }

    // Detect comeback & recovery first
    const comebackSignal = await detectComeback(user._id);
    console.log(`✓ [WORKER] Comeback detected:`, comebackSignal ? 'yes' : 'no');
    
    let recoverySignal = null;

    if (comebackSignal) {
      recoverySignal = await handleRecovery(user, comebackSignal);
      console.log(`✓ [WORKER] Recovery handled`);

      await PressureEvent.findByIdAndUpdate(
        comebackSignal.sourcePressureEventId,
        { isConsumed: true }
      );
    } else {
      recoverySignal = updateRecoveryProgress(user);
      console.log(`✓ [WORKER] Recovery progress updated`);
    }

    // Compute behavioral analytics AFTER recovery update
    const dynamicPressure = await computeDynamicPressure(userId);
    console.log(`✓ [WORKER] Dynamic pressure computed:`, dynamicPressure.level);

    if (dynamicPressure.level === "high") {
      await PressureEvent.create({
        userId,
        type: "BEHAVIORAL_PRESSURE",
        severity: "high",
        context: dynamicPressure.breakdown,
      });
      console.log(`✓ [WORKER] High pressure event created`);
    }

    const streakTrend = await computeStreakTrend(userId);
    console.log(`✓ [WORKER] Streak trend computed`);
    
    const weeklyConsistency = await computeWeeklyConsistency(userId);
    console.log(`✓ [WORKER] Weekly consistency computed`);

    // Orchestrate response (NOW recoverySignal exists)
    const finalResponse = orchestrateResponse({
      dynamicPressure,
      streakTrend,
      weeklyConsistency,
      recoverySignal,
    });
    console.log(`✓ [WORKER] Response orchestrated`);

    const uiMessage = finalResponse?.intent
      ? mapIntentToMessage(finalResponse.intent)
      : null;
    console.log(`✓ [WORKER] UI message mapped`);

    const reinforcementSignal = generateReinforcementSignal(user, recoverySignal);
    console.log(`✓ [WORKER] Reinforcement signal generated`);

    await user.save();
    console.log(`✓ [WORKER] User saved`);

    const problem = await Problem.findById(problemId).populate("patterns");
    if (!problem) {
      throw new Error("Problem not found");
    }
    console.log(`✓ [WORKER] Problem found with ${problem.patterns.length} patterns`);
    
    for (const pattern of problem.patterns) {
      await updatePatternProgress({
        userId,
        pattern,
        isCorrect,
        difficulty,
      });
    }
    console.log(`✓ [WORKER] Pattern progress updated for all patterns`);

    console.log(`✅ [WORKER] Job ${job.id} completed successfully!\n`);
    
  } catch (error) {
    console.error(`❌ [WORKER] Job ${job.id} error:`, error.message);
    console.error(`Stack trace:`, error.stack);
    throw error;
  }
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

// Error handling for the worker
worker.on('error', (error) => {
  console.error(`❌ [WORKER] Worker error:`, error.message);
});

worker.on('failed', (job, error) => {
  console.error(`❌ [WORKER] Job ${job.id} failed permanently:`, error.message);
});

console.log('✅ [WORKER] Submission worker initialized and listening for jobs');

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
  if (!progress) {
    progress = await UserPatternProgress.create({
      userId,
      patternId: pattern._id,
    });
  }

  // Update attempts
  progress.problemsAttempted += 1;
  progress.lastPracticedAt = new Date();
  if (isCorrect) {
    progress.problemsSolved += 1;
    if (difficulty === "Easy") progress.easySolved += 1;
    if (difficulty === "Medium") progress.mediumSolved += 1;
    if (difficulty === "Hard") progress.hardSolved += 1;
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

module.exports = worker;