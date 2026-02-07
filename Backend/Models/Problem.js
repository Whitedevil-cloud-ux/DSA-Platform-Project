const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },

        patterns: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pattern",
                required: true,
            },
        ],

        source: [
            {
                type: String,
                enum: ["Leetcode", "Codeforces", "Custom"],
                default: "Custom",
            },
        ],

        interviewFrequency: {
            type: Number,
            min: 1, 
            max: 5,
            default: 3,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Problem", problemSchema);