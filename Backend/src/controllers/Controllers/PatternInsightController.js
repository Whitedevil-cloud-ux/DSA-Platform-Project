const PatternInsightManager = require("../../processors/Managers/PatternInsightManager");
const PatternInsightPresenter = require("../../mappers/Presenters/PatternInsightPresenter");

async function fetchPatternInsights(req, res, next) {
    try {
        const insights = await PatternInsightManager.fetchPatternInsights({
            userId: req.user.id,
        });

        res.status(200).json(
            PatternInsightPresenter.patternInsightsFetched(insights)
        );
    } catch (error) {
        next(error);
    }
}

module.exports = { fetchPatternInsights };
