const ProblemManager = require("../Managers/ProblemManager");
const ProblemPresenter = require("../Presenters/ProblemPresenter");

const getAllProblems = async (req, res, next) => {
    try {
        const problems = await ProblemManager.getAllProblems();

        res.status(200).json(
            ProblemPresenter.problemsFetched(problems)
        );
    } catch (error) {
        next(error);
    }
};

const getProblemBySlug = async(req, res, next) => {
    try {
        const problem = await ProblemManager.getProblemBySlug({
            slug: req.params.slug,
        });

        res.status(200).json(
            ProblemPresenter.problemFetched(problem)
        );
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllProblems, getProblemBySlug };
