class PatternInsightPresenter {
    static patternInsightsFetched(data) {
        return {
            success: true,
            message: "Pattern insights fetched successfully",
            data,
        };
    }
}

module.exports = PatternInsightPresenter;
