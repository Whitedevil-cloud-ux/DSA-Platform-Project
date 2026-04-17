const InsightManager = require("../Managers/InsightManager");
const InsightPresenter = require("../Presenters/InsightPresenter");

async function fetchUserInsights(req, res, next) {
    try {
        const insights = await InsightManager.fetchUserInsights({
            userId: req.user.id,
        });

        res.status(200).json(
            InsightPresenter.insightsFetched(insights)
        );
    } catch (error) {
        next(error);
    }
}

module.exports = { fetchUserInsights };
