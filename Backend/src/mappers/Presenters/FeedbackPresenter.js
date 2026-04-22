class FeedbackPresenter {
    static feedbackFetched(data) {
        return {
            success: true,
            message: "Feedback fetched successfully",
            data,
        };
    }
}

module.exports = FeedbackPresenter;
