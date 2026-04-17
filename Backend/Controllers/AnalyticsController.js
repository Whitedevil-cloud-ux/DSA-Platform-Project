const AnalyticsManager = require("../Managers/AnalyticsManager");
const AnalyticsPresenter = require("../Presenters/AnalyticsPresenter");

const getConfidenceAnalytics = async(req, res, next) => {
    try{
        const confidenceAnalytics =
            await AnalyticsManager.getConfidenceAnalytics({
                userId: req.user.id,
            });

        res.status(200).json(
            AnalyticsPresenter.confidenceAnalyticsFetched(
                confidenceAnalytics
            )
        );
    }catch(error) {
        next(error);
    }
};

module.exports = { getConfidenceAnalytics };
