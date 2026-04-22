const { getPatternInsights } = require("../../../services/services/PatternInsightService");
const ApiError = require("../../../utils/ApiError");

class PatternInsightManager {
    static async fetchPatternInsights({ userId }) {
        if (!userId) {
            throw new ApiError(401, "User is required");
        }

        return getPatternInsights(userId);
    }
}

module.exports = PatternInsightManager;
