const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
        },

        isCorrect: {
            type: Boolean,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        language: {
            type: String,
            default: "unknown",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Submission", submissionSchema);