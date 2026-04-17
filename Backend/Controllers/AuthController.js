const AuthManager = require("../Managers/AuthManager");
const AuthPresenter = require("../Presenters/AuthPresenter");

async function signup(req, res, next) {
    try {
        const signupResult = await AuthManager.signup(req.body);

        res.status(201).json(
            AuthPresenter.signupSuccessful(signupResult)
        );
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const loginResult = await AuthManager.login(req.body);

        res.status(200).json(
            AuthPresenter.loginSuccessful(loginResult)
        );
    } catch (error) {
        next(error);
    }
}

module.exports = { signup, login };
