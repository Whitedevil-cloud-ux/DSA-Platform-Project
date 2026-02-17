const { getPatternInsights } = require("../services/PatternInsightService");

async function fetchPatternInsights(req, res) {
    try {
        const userId = req.user.id;
        const insights = await getPatternInsights(userId);
        res.json(insights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch pattern insights" });
    }
}

module.exports = { fetchPatternInsights };