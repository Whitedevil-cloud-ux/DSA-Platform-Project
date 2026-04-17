class DashboardPresenter {
    static dashboardStatsFetched(data) {
        return {
            success: true,
            message: "Dashboard stats fetched successfully",
            data,
        };
    }
}

module.exports = DashboardPresenter;
