const { getUserInsights } = require("../../../services/services/InsightService");
const ApiError = require("../../../utils/ApiError");

class InsightManager {
    static async fetchUserInsights({ userId }) {
        if (!userId) {
            throw new ApiError(401, "User is required");
        }

        return getUserInsights(userId);
    }
}

module.exports = InsightManager;
