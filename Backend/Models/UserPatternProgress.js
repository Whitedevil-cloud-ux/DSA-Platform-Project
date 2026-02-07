const mongoose = require("mongoose");

const userPatternProgressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        patternId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pattern",
            required: true,
        },

        problemsAttempted: {
            type: Number,
            default: 0,
        },

        problemsSolved: {
            type: Number,
            default: 0,
        },

        easySolved: {
            type: Number,
            default: 0,
        },

        mediumSolved: {
            type: Number,
            default: 0,
        }, 

        hardSolved: {
            type: Number,
            default: 0,
        },

        accuracy: {
            type: Number,
            min: 0,
            max: 1, 
            default: 0,
        },

        masteryScore: {
            type: Number,
            default: 0,
        },

        confidenceLevel: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },

        lastPracticedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

userPatternProgressSchema.index({ userId: 1, patternId: 1 }, { unique: true });

module.exports = mongoose.model("UserPatternProgress", userPatternProgressSchema);