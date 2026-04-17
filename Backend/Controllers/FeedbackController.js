const FeedbackManager = require("../Managers/FeedbackManager");
const FeedbackPresenter = require("../Presenters/FeedbackPresenter");

async function getFeedback(req, res, next) {
    try {
        const feedback = await FeedbackManager.getFeedback({
            userId: req.user.id,
        });

        return res.status(200).json(
            FeedbackPresenter.feedbackFetched(feedback)
        );
    } catch (error) {
        next(error);
    }
}

module.exports = { getFeedback };
