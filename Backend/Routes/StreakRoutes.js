const express = require("express");
const router = express.Router();

const UserStreak = require("../Models/UserStreak");
const auth = require("../Middlewares/AuthMiddleware");

function normalizeDate(date){
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

router.get("/me", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const today = normalizeDate(new Date());
        const streak = await UserStreak.findOne({ userId });
        if(!streak){
            return res.json({
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: null,
                isActiveToday: false,
            });
        }
        const isActiveToday = streak.lastActiveDate && normalizeDate(streak.lastActiveDate).getTime() === today.getTime();
        res.json({
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastActiveDate: streak.lastActiveDate,
            isActiveToday,
        });
    } catch (error) {
        console.error("Streak fetch error: ", error);
        res.status(500).json({ message: "Failed to fetch streak" });
    }
});

module.exports = router;