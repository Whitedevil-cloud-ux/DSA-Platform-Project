const mongoose = require("mongoose");
const Submission = require("../Models/Submission");

const getConfidenceAnalytics = async(req, res) => {
    try{
        const userId = req.user.id;
        const aggregation = await Submission.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: "$confidence",
                    count: { $sum: 1 }
                }
            }
        ]);

        const confidenceData = { high: 0, medium: 0, low: 0};
        aggregation.forEach(item => {
            if(item._id) {
                confidenceData[item._id.toLowerCase()] = item.count;
            }
        });
        res.status(200).json(confidenceData);
    }catch(error) {
        console.error("Confidence Analytics Error: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getConfidenceAnalytics };