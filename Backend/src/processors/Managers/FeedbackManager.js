const User = require("../../../Models/User");
const { generateFeedback } = require("../../../services/services/FeedbackService");
const ApiError = require("../../../utils/ApiError");

class FeedbackManager {
    static async getFeedback({ userId }) {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const signals = {
            pressureLevel: 4,
            streakTrend: "down",
            lastActiveHours: 26,
            difficultyShift: "lower",
            weeklyConsistency: 35,
        };

        const feedback = await generateFeedback({
            signals,
            lastFeedbackAt: user.lastFeedbackAt,
        });

        if (feedback.show) {
            user.lastFeedbackAt = new Date();
            await user.save();
        }

        return feedback;
    }
}

module.exports = FeedbackManager;
