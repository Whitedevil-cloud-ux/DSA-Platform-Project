const DashboardManager = require("../Managers/DashboardManager");
const DashboardPresenter = require("../Presenters/DashboardPresenter");

const getDashboardStats = async (req, res, next) => {
    try {
        const dashboardStats = await DashboardManager.getDashboardStats({
            userId: req.user.id,
        });

        res.status(200).json(
            DashboardPresenter.dashboardStatsFetched(dashboardStats)
        );
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardStats };
