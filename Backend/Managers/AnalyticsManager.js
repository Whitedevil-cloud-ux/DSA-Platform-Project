const mongoose = require("mongoose");
const Submission = require("../Models/Submission");
const ApiError = require("../utils/ApiError");

class AnalyticsManager {
    static async getConfidenceAnalytics({ userId }) {
        if (!userId) {
            throw new ApiError(401, "User is required");
        }

        const aggregation = await Submission.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $group: {
                    _id: "$confidence",
                    count: { $sum: 1 },
                },
            },
        ]);

        const confidenceData = { high: 0, medium: 0, low: 0 };
        aggregation.forEach((item) => {
            if (item._id) {
                confidenceData[item._id.toLowerCase()] = item.count;
            }
        });

        return confidenceData;
    }
}

module.exports = AnalyticsManager;
