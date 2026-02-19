const Problem = require("../Models/Problem");

const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find({ isActive: true }).populate("patterns", "name").sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: problems, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch problems" });
    }
};

const getProblemBySlug = async(req, res) => {
    try {
        const { slug } = req.params;
        const problem = await Problem.findOne({
            slug,
            isActive: true,
        }).populate("patterns", "name");

        if(!problem){
            res.status(404).json({ success: false, message: "Problem not found" });
        }

        res.status(200).json({ success: true, data: problem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch problem" });
    }
};

module.exports = { getAllProblems, getProblemBySlug };