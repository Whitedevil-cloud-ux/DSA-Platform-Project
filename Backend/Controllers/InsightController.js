const { getUserInsights } = require("../services/InsightService");

async function fetchUserInsights(req, res) {
    try {
        const userId = req.user.id;
        const insights = await getUserInsights(userId);
        res.status(200).json({ success: true, data: insights });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { fetchUserInsights };