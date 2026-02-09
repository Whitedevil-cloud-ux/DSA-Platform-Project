const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email is required"],
        unique: true,
    },

    username: {
        type: String,
        required: [true, "Your username is required"],
    },

    password: {
        type: String,
        required: [true, "Your password is required"],
    },

    createdAt: {
        type: Date,
        default: new Date(),
    },

    onboarding: {
        level: {
            type: String,
            enum: ["beginner", "intermediate"],
        },
        goal: {
            type: String,
            enum: ["interview", "revision"],
        },
        dailyTime: {
            type: Number,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },

    lastActiveDate: {
        type: String,
        default: null,
    },

    currentStreak: {
        type: Number,
        default: 0,
    },

    maxStreak: {
        type: Number,
        default: 0,
    },

    lastPressureAt: {
        type: Date,
        default: null,
    },

    recoveryStreak: {
        type: Number,
        default: 0,
    },

    inRecovery: {
        type: Boolean,
        default: false,
    },

    pressureCooldownUntil: {
        type: Date,
        default: null,
    },
});

userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);