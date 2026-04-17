const User = require("../Models/User");
const ApiError = require("../utils/ApiError");

class UserManager {
    static async onboardingUser({ user, level, goal, dailyTime }) {
        if (!user) {
            throw new ApiError(401, "User is required");
        }

        if (!level || !goal || !dailyTime) {
            throw new ApiError(400, "All fields are required");
        }

        user.onboarding = {
            level,
            goal,
            dailyTime,
            completed: true,
        };

        await user.save();

        return user.onboarding;
    }

    static async getUserProfile({ userId }) {
        if (!userId) {
            throw new ApiError(401, "User is required");
        }

        const user = await User.findById(userId).select(
            "username email onboarding"
        );

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return {
            name: user.username,
            email: user.email,
            onboarding: user.onboarding,
        };
    }
}

module.exports = UserManager;
