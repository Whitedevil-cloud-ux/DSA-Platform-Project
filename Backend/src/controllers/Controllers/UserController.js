const UserManager = require("../../processors/Managers/UserManager");
const UserPresenter = require("../../mappers/Presenters/UserPresenter");

const onboardingUser = async (req, res, next) => {
  try {
    const onboarding = await UserManager.onboardingUser({
      user: req.user,
      ...req.body,
    });

    res.status(200).json(
      UserPresenter.onboardingCompleted(onboarding)
    );
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const profile = await UserManager.getUserProfile({
      userId: req.user.id,
    });

    res.status(200).json(
      UserPresenter.profileFetched(profile)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  onboardingUser,
  getUserProfile,
};
