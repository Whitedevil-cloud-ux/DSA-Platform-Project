// The presenter standardizes API responses across the platform.
class SubmissionPresenter {
    static submissionCreated(data){
        return {
            success: true,
            message: "Submission recorded successfully",
            data,
        };
    }

    static submissionsFetched(data) {
        return {
            success: true,
            message: "Submission fetched successfully",
            data,
        };
    }

    static confidenceUpdated(data) {
        return {
            success: true,
            message: "Submission updated successfully",
            data,
        }
    };
}

module.exports = SubmissionPresenter;