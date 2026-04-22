class AuthPresenter {
    static signupSuccessful({ token, user }) {
        return {
            success: true,
            message: "User signed up successfully",
            data: {
                token,
                user,
            },
        };
    }

    static loginSuccessful({ token, user }) {
        return {
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                user,
            },
        };
    }
}

module.exports = AuthPresenter;
