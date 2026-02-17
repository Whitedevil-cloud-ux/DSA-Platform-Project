const User = require("../Models/User");
const { generateFeedback } = require("../services/FeedbackService");

async function getFeedback(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const signals = {
            // pressureLevel: user.pressureLevel || 0,
            // streakTrend: user.streakTrend || "stable",
            // lastActiveHours: user.lastActiveHours || 0,
            // difficultyShift: user.difficultyShift || "same",
            // weeklyConsistency: user.weeklyConsistency || 50,

            pressureLevel: 4,
            streakTrend: "down",
            lastActiveHours: 26,
            difficultyShift: "lower",
            weeklyConsistency: 35,
        };
        const feedback = await generateFeedback({ signals, lastFeedbackAt: user.lastFeedbackAt, });
        if(feedback.show){
            user.lastFeedbackAt = new Date();
            await user.save();
        }
        return res.json(feedback);
    } catch (error) {
        console.error("Feedback error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getFeedback };