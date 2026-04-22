const { scoreIntents } = require("./IntentScorer");
const { mapIntentToMessage } = require("./MessageMapper");
const { applyFeedbackPolicy } = require("./FeedbackPolicy");

async function generateFeedback({ signals, lastFeedbackAt }) {
  const { dominantIntent, intentScores } = scoreIntents(signals);
  const policyResult = applyFeedbackPolicy({
    dominantIntent,
    intentScores,
    signals,
    lastFeedbackAt,
  });

  if (!policyResult.allow) {
    return { show: false };
  }

  const finalIntent =
    policyResult.overrideIntent || dominantIntent;

  const messageData = mapIntentToMessage(finalIntent);
  if (!messageData) {
    return { show: false };
  }
console.log("Dominant Intent:", dominantIntent);
console.log("Intent Scores:", intentScores);
  return {
    show: true,
    intent: finalIntent,
    tone: messageData.tone,
    message: messageData.message,
    actionLabel: messageData.actionLabel,
    generatedAt: Date.now(),
  };
}

module.exports = { generateFeedback };
