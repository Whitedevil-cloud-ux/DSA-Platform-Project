class AnalyticsPresenter {
    static confidenceAnalyticsFetched(data) {
        return {
            success: true,
            message: "Confidence analytics fetched successfully",
            data,
        };
    }
}

module.exports = AnalyticsPresenter;
