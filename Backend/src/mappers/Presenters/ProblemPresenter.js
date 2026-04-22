class ProblemPresenter {
    static problemsFetched(data) {
        return {
            success: true,
            message: "Problems fetched successfully",
            data,
        };
    }

    static problemFetched(data) {
        return {
            success: true,
            message: "Problem fetched successfully",
            data,
        };
    }
}

module.exports = ProblemPresenter;
