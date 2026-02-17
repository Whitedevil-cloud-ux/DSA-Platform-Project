function applyFeedbackPolicy({
  dominantIntent,
  intentScores,
  signals,
  lastFeedbackAt,
}) {
  const now = Date.now();
  const FOUR_HOURS = 4 * 60 * 60 * 1000;

  // Rule 1: No signal
  if (dominantIntent === "SILENT") {
    return { allow: false };
  }

  // Rule 2: Cooldown
  if (lastFeedbackAt && now - lastFeedbackAt < FOUR_HOURS) {
    return { allow: false };
  }

  // Rule 3: Prevent praise under pressure
  if (
    dominantIntent === "REINFORCE" &&
    signals.pressureLevel >= 4
  ) {
    return { allow: true, overrideIntent: "STABILIZE" };
  }

  return { allow: true };
}

module.exports = { applyFeedbackPolicy };
