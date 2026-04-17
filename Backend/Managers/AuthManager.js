const bcrypt = require("bcrypt");
const User = require("../Models/User");
const { createSecretToken } = require("../util/SecretToken");
const ApiError = require("../utils/ApiError");

class AuthManager {
    static async signup({ email, password, username, createdAt }) {
        if (!email || !password || !username) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        const user = await User.create({
            email,
            password,
            username,
            createdAt,
        });

        return {
            token: createSecretToken(user._id),
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        };
    }

    static async login({ email, password }) {
        if (!email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(401, "Incorrect email or password");
        }

        const isAuthenticated = await bcrypt.compare(password, user.password);
        if (!isAuthenticated) {
            throw new ApiError(401, "Incorrect email or password");
        }

        return {
            token: createSecretToken(user._id),
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        };
    }
}

module.exports = AuthManager;
