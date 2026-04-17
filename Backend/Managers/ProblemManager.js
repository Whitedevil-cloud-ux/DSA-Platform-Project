const Problem = require("../Models/Problem");
const ApiError = require("../utils/ApiError");

class ProblemManager {
    static async getAllProblems() {
        return Problem.find({ isActive: true })
            .populate("patterns", "name")
            .sort({ createdAt: -1 });
    }

    static async getProblemBySlug({ slug }) {
        if (!slug) {
            throw new ApiError(400, "Problem slug is required");
        }

        const problem = await Problem.findOne({
            slug,
            isActive: true,
        }).populate("patterns", "name");

        if (!problem) {
            throw new ApiError(404, "Problem not found");
        }

        return problem;
    }
}

module.exports = ProblemManager;
