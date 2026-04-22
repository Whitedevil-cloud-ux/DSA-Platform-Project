class UserPresenter {
    static onboardingCompleted(data) {
        return {
            success: true,
            message: "Onboarding completed successfully",
            data,
        };
    }

    static profileFetched(data) {
        return {
            success: true,
            message: "User profile fetched successfully",
            data,
        };
    }
}

module.exports = UserPresenter;
