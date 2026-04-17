// The controller becomes lightweight and delegates responsibilities to the Manager and Presenter
const SubmissionManager = require("../Managers/SubmissionManager");
const SubmissionPresenter = require("../Presenters/SubmissionPresenter");

async function submitProblem(req, res, next) {
    try {
        const userId = req.user.id;
        const submission = await SubmissionManager.submitProblem({
            userId,
            ...req.body,
        });

        res.status(201).json(
            SubmissionPresenter.submissionCreated(submission)
        );
    } catch (error) {
        next(error);
    }
}

async function getProblemSubmissions(req, res, next) {
    try {
        const { problemId } = req.params;
        const userId = req.user.id;

        const submissions = await SubmissionManager.getProblemSubmissions({
            userId,
            problemId,
        });
        res.status(200).json(
            SubmissionPresenter.submissionsFetched(submissions)
        );
    } catch (error) {
        next(error);
    }
}

async function updateConfidence(req, res, next) {
    try {
        const { submissionId } = req.params;
        const { confidence } = req.body;
        const userId = req.user.id;
        
        const updated = await SubmissionManager.updateConfidence({
            userId,
            submissionId,
            confidence,
        });

        res.status(200).json(
            SubmissionPresenter.confidenceUpdated(updated)
        );
    } catch (error) {
        next(error);
    }
}



module.exports = { submitProblem, getProblemSubmissions, updateConfidence };
