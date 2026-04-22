class InsightPresenter {
    static insightsFetched(data) {
        return {
            success: true,
            message: "Insights fetched successfully",
            data,
        };
    }
}

module.exports = InsightPresenter;
