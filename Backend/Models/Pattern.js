const mongoose = require("mongoose");

const patternSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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

        difficultyLevels: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: ["Easy", "Medium", "Hard"],
        },

        prerequisites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pattern",
            },
        ],

        interviewWeight: {
            type: Number,
            min: 1,
            max: 10,
            default: 5,
        },

        orderIndex: {
            type: Number,
            required: true,
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

module.exports = mongoose.model("Pattern", patternSchema);