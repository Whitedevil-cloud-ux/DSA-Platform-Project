const { signup, login } = require("../Controllers/AuthController");
const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;