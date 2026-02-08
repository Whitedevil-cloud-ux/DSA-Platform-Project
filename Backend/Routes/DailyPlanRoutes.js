const express = require("express");
const router = express.Router();

const { generateDailyPlan } = require("../services/DailyPlan");
const auth = require("../Middlewares/AuthMiddleware");

router.get("/today", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const plan = await generateDailyPlan(userId);
        res.status(200).json({
            date: new Date().toISOString().split("T")[0],
            totalPatterns: plan.length,
            totalProblems: plan.reduce(
                (acc, p) => acc + p.problems.length, 0
            ),
            plan,
        });
    } catch (error) {
        console.error("Daily plan error : ", error);
        res.status(500).json({ message: "Failed to generate daily plan "});
    }
});

module.exports = router;