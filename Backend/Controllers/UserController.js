const User = require("../Models/User");

const onboardingUser = async (req, res) => {
    console.log("Req user: ", req.user);
  try {
    const { level, goal, dailyTime } = req.body;

    if (!level || !goal || !dailyTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    req.user.onboarding = {
      level,
      goal,
      dailyTime,
      completed: true,
    };

    await req.user.save();

    res.status(200).json({
      message: "Onboarding completed successfully",
      onboarding: req.user.onboarding,
    });
  } catch (error) {
    console.error("Onboarding error: ", error);
    return res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
    onboarding: req.user.onboarding,
  });
};

module.exports = {
  onboardingUser,
  getUserProfile,
};
